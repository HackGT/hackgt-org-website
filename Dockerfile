FROM debian:8
WORKDIR /code
ADD . /code
RUN apt-get update && apt-get install -y \
    ruby-full \
    build-essential \
    imagemagick \
    libmagick-dev
RUN ls && gem install -f bundler jekyll && bundle install
EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0", "--watch", "--incremental"]

