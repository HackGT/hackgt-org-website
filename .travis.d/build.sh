#!/usr/bin/env bash
# HACKGPROJECT VERSION: 302160909a4f927434ad22a9e372242e15648e7c
set -euo pipefail
PROJECT_TYPE="deployment"
ORG_NAME="hackgt"
SOURCE_DIR=$(readlink -f "${BASH_SOURCE[0]}")
SOURCE_DIR=$(dirname "$SOURCE_DIR")
cd "${SOURCE_DIR}/.."
set -x

if ! hash docker &>/dev/null; then
    echo 'Cannot find the docker binary!' >&2
    exit 64
fi

docker=
if docker ps &>/dev/null; then
    docker=docker
else
    docker='sudo docker'
fi

remote=$(git remote -v | grep -Pio "${ORG_NAME}"'/[a-zA-Z0-9-_\.]*' | head -1)
image_name=$(basename "${remote%.*}")

build_project_source() {
    if [[ -f Dockerfile.build ]]; then
        local build_image_name
        build_image_name="$(basename "$(pwd)")-build"
        $docker build -f Dockerfile.build --rm -t "$build_image_name" .
        sudo chown -R "$(id -u):$(id -g)" .
    fi
}

test_project_source() {
    if [[ -f Dockerfile.test ]]; then
        local test_image_name
        test_image_name="$(basename "$(pwd)")-test"
        $docker build -f Dockerfile.test --rm -t "$test_image_name" .
        $docker run -w '/src' -v "$(pwd):/src" "$test_image_name"
        sudo chown -R "$(id -u):$(id -g)" .
    fi
}

build_project_container() {
    $docker build -f Dockerfile --rm -t "$image_name" .
}

git_branch() {
    if [[ ${TRAVIS_PULL_REQUEST_BRANCH} ]]; then
        echo "${TRAVIS_PULL_REQUEST_BRANCH}"
    else
        echo "${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
    fi
}

git_branch_id() {
    git_branch | sed 's/[^0-9a-zA-Z_-]/-/g'
}

publish_project_container() {
    local git_rev
    local branch
    git_rev=$(git rev-parse HEAD)
    branch=$(git_branch_id)
    local latest_tag_name="latest"
    local push_image_name="${DOCKER_ID_USER}/${image_name}"
    if [[ $branch != master ]]; then
        latest_tag_name="latest-${branch}"
    fi
    docker login -u="${DOCKER_ID_USER}" -p="${DOCKER_PASSWORD}"
    docker tag "$image_name" "$push_image_name":"$git_rev"
    docker push "$push_image_name"
    docker tag "$push_image_name":"$git_rev" "$push_image_name":"$latest_tag_name"
    docker push "$push_image_name"
}

trigger_biodomes_build() {
    body='{
    "request": {
    "branch":"master"
    } }'

    curl -s -X POST \
         -H "Content-Type: application/json" \
         -H "Accept: application/json" \
         -H "Travis-API-Version: 3" \
         -H "Authorization: token ${TRAVIS_TOKEN}" \
         -d "$body" \
         https://api.travis-ci.org/repo/${ORG_NAME}%2Fbiodomes/requests
}

install_jekyll() {
    gem install jekyll
    bundle install
}

build_jekyll() {
    bundle exec jekyll build
}

commit_to_branch() {
    local branch
    local git_rev
    branch="${1:-gh-pages}"
    git_rev=$(git rev-parse --short HEAD)
    git config user.name 'HackGBot'
    git config user.email 'thehackgt@gmail.com'
    git remote remove origin
    git remote add origin \
        "https://${GH_TOKEN}@github.com/${ORG_NAME}/${image_name}.git"
    git fetch origin
    git reset "origin/$branch" || git checkout -b "$branch"
    git add -A .
    git status
    git commit -m "Automatic Travis deploy of ${git_rev}."
    git push -q origin "HEAD:${branch}"
}

push_to_biodomes() {
    local path="$1"
    local file="$2"

    pushd "$(mktemp -d)"
    git clone --depth 1 "https://github.com/${ORG_NAME}/biodomes.git" .
    git config user.name 'HackGBot'
    git config user.email 'thehackgt@gmail.com'
    git remote remove origin
    git remote add origin \
        "https://${GH_TOKEN}@github.com/${ORG_NAME}/biodomes.git"
    mkdir -p "$(dirname "${path}")"
    echo "$file" > "$path"
    git add -A .
    git status

    if git diff-index --quiet HEAD --; then
        echo 'Nothing to commit, skipping biodomes push.'
    else
        git commit -m "Automatic deploy of ${image_name} to ${path}."
        git push -q origin "HEAD:master"
    fi
    popd
}

github_comment() {
    local body="$1"
    local pr_id="$2"
    local data
    data=$(jq -nMc "{body:\"${message}\"}")

    curl -X POST \
         -H 'Accept: application/vnd.github.v3+json' \
         -H "Authorization: token ${GH_TOKEN}" \
         --data "${data}" \
         "https://api.github.com/repos/${ORG_NAME}/${image_name}/issues/${pr_id}/comments"
}

github_list_comments() {
    local pr_id="$1"
    curl "https://api.github.com/repos/${ORG_NAME}/${image_name}/issues/${pr_id}/comments" \
        | jq -r '.[].body'
}

find_pr_number() {
    if [[ ${TRAVIS_PULL_REQUEST} ]]; then
        echo "${TRAVIS_PULL_REQUEST}"
    else
        curl "https://api.github.com/repos/${ORG_NAME}/${image_name}/pulls" \
            | jq ".[] | select(.head.ref == \"$(git_branch)\") | .number"
    fi
}

make_pr_deployment() {
    local app_domain
    local message
    local pr_id
    local test_url
    local deployment_conf

    app_domain="${image_name}-$(git_branch_id)"
    pr_id=$(find_pr_number)
    test_url="https://${app_domain}.pr.hack.gt"
    deployment_conf=$(cat <<-END
git:
    remote: "https://github.com/${remote}"
    branch: "$(git_branch)"

secrets-source: git-${ORG_NAME}-${image_name}-secrets
END
    )
    message=$(cat <<-END
Hey y'all! A deployment of this PR can be found here:
${test_url}
END
    )

    push_to_biodomes "pr/${app_domain}.yaml" "${deployment_conf}"

    if ! github_list_comments "${pr_id}" | grep "${test_url}"; then
        github_comment "${message}" "${pr_id}"
    fi
}

set_cloudflare_dns() {
    local type="$1"
    local name="$2"
    local content="$3"
    local proxied="$4"
    local type_downcase
    local name_downcase
    local content_downcase
    local dns_records
    type_downcase=$(echo "${type}" | tr '[:upper:]' '[:lower:]')
    name_downcase=$(echo "${name}" | tr '[:upper:]' '[:lower:]')
    content_downcase=$(echo "${content}" | tr '[:upper:]' '[:lower:]')

    # get all the dns records
    dns_records=$(curl -X GET \
          -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
          -H "X-Auth-Key: ${CLOUDFLARE_AUTH}" \
          -H "Content-Type: application/json" \
          "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/dns_records" \
          | tr '[:upper:]' '[:lower:]')

    # Check if we already set it
    local jq_exists
    jq_exists=$(cat <<-END
        .result[]
        | select(.type == "${type_downcase}")
        | select(.name == "${name_downcase}")
        | select(.content == "${content_downcase}")
END
    )
    if [[ -n $(echo "${dns_records}" | jq "${jq_exists}") ]]; then
        echo "Record already set, not setting again."
        return
    fi

    # Check if there's a different one already set
    local duplicate_exists
    duplicate_exists=$(echo "${dns_records}" \
        | jq '.result[] | select(.name == "'"${name_downcase}"'")')
    if [[ -n $duplicate_exists ]]; then
        echo "Record with the same host exists, will not overwrite!"
        exit 64
    fi

    # Set IT!
    local dns_record
    dns_record=$(cat <<-END
        {
            "type": "${type}",
            "name": "${name}",
            "content": "${content}",
            "proxied": $proxied
        }
END
    )
    local dns_success
    dns_success=$(curl -X POST \
         --data "$dns_record" \
         -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
         -H "X-Auth-Key: ${CLOUDFLARE_AUTH}" \
         -H "Content-Type: application/json" \
         "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE}/dns_records")

    if [[ $dns_success != true ]]; then
        echo 'DNS Setting on cloudflare failed!!'
        echo 'CloudFlare output:'
        echo "$dns_success"
        exit 64
    fi
    echo DNS set! You\'ll have to wait a bit to see the changes!
}


deployment_project() {
    build_project_container

    if [[ ${TRAVIS_PULL_REQUEST:-} = false ]]; then
        publish_project_container
        trigger_biodomes_build
    elif ! [[ ${TRAVIS_PULL_REQUEST_SLUG} =~ ^${ORG_NAME}/ ]]; then
        make_pr_deployment
    fi
}

static_project() {
    if [[ ${TRAVIS_PULL_REQUEST:-} = false ]]; then
        commit_to_branch 'gh-pages'
        set_cloudflare_dns CNAME "$(cat CNAME)" "${ORG_NAME}.github.io" true
    fi
}


# Build & Test the project, if needed.
build_project_source
test_project_source

case "$PROJECT_TYPE" in
    deployment)
        deployment_project
        ;;
    static)
        static_project
        ;;
    *)
        echo "Unknown project type!"
        exit 1
esac

