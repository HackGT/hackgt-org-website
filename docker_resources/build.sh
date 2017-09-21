#!/bin/sh
gem install bundler jekyll
bundle install --path vendor/bundle 
bundle exec ruby precheck.rb
bundle exec jekyll build