FROM debian:8

WORKDIR /code
ADD . /code

RUN apt-get update && apt-get install -y \
    ruby-full \
    build-essential \
    imagemagick \
    libmagickwand-dev
RUN gem install bundler && bundle install --path vendor/bundle

EXPOSE 4000
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0", "--watch", "--incremental"]

