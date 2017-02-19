# hackgt-org-website
Stateless, Dateless, Flawless

## Configure Jekyll
```BASH
gem --version || sudo gem install ruby
bundle --version || sudo gem install bundler
sudo apt-get install imagemagick libmagickwand-dev
sudo gem install rmagick -v '2.16.0'
bundle install
jekyll serve
```

or if you don't want to install these deps globally:

```BASH
bundle install --path vendor/bundle
bundle exec jekyll serve
```

## Instructions for Updating Website


###Adding/Removing/Editing member of HackGT
Edit `/_data/members.csv` and your changes should be reflected

TBD - Way to specifiy path to image
