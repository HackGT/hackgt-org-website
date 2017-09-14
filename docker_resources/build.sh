#!/bin/sh
gem install bundler jekyll
bundle install --path vendor/bundle 
bundle exec jekyll build