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

A Dockerfile is included for convenience.

## Instructions for Updating Website

### Adding/Removing/Editing member of HackGT
Edit `/_data/members.csv` and your changes should be reflected

TBD - Way to specifiy path to image

## Creating a Blog Post

Any new blog post can be added by creating a new file in the `_posts/` directory. This can be done in two ways, either on your desktop or right here on Github!

### Browser

Assuming you are reading this in the [browser](https://www.github.com/hackgt/hackgt-org-website), click `Create new file` button right above all the files and commit history. When specifying the path, type in `_posts/NAME_OF_YOUR_POST`. Naming convention is MANDATORY for correct display on the website and is as follows: `YYYY-MM-DD-NAME_OF_POST.md`. For example, if you are adding a post titled "Hello HackGT" on July 10, 2017, you would name your file `2017-07-10-hello-hackgt.md`. Before adding your content, you will need to add the following header to your file.

```
---
title: TITLE_OF_POST
layout: posts
categories: blog posts
description: A short description of your post.
---
```

Please note the three dashes at the beginning and end. After this, you are now ready to write/paste/create your content. To style and format your content correctly, you can use [markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet) or HTML, and remember you can preview your work! When you are finished adding the content, scroll to the bottom of the page. Create a commit title and description that clearly explains what you are adding (i.e. "Added blog post about HackG5"), and change the branch name to `USERNAME-blog-TITLE`, and click the "commit new file" button. This will create a new branch with your new file, and the last thing to be done is to create a pull request. This should take you to a new screen, make sure everything is in order, and then click the create pull request button to submit your changes. Then, our Biodomes service will create a test deployment to preview your changes on a copy of the live site from a unique URL. After you've verified everything looks good, let a member of tech team know you have submitted something new, and he/she will confirm your changes, and approve and merge your pull request. Once this is done you should be able to see your post live on our site!


### Desktop

Desktop editing is only recommended if you are proficient with Git. Repeat the above instructions, but do the creation locally, and then push your changes.
