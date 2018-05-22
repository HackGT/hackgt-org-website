---
title: "So you want to use Postgres in Beehive?"
layout: posts
categories: blog posts
author: Andrew Dai
image: pg_initalaser.png
---

tl;dr: [pg_initalaser](https://github.com/HackGT/pg_initialaser) is a short and sweet SQL script for creating a user and database on a Postgres server packaged as a Docker container made for easy deployment as an Init Container in Kubernetes to allow for the automatic creation of deployment-specific databases.

_AKA arguably the world’s simplest use case for Init Containers in k8s_

## Background

But first, let’s talk about MongoDB[^1].

[^1]: MongoDB is web scale. See [https://www.youtube.com/watch?v=b2F-DItXtZs](https://www.youtube.com/watch?v=b2F-DItXtZs)

{% render_image pg_initalaser1.png | A reasoned discussion about the pros and cons of certain technologies %}

For the most part, performance issues have ~~never~~ rarely been an issue with our deployed apps. The choice of database or other technologies has mostly been driven by what people are familiar with or want to use. Most HackGT applications use MongoDB, taking advantage of its simple set up in development environments and natural and easy integration with Node.js.

MongoDB allows for the easy (automatic) creation of new databases[^2]. Whenever a connection is made to a MongoDB host, a new database is automatically created if the requested database does not already exist.

[^2]: Here, a database is not the same as a database instance/server/host. A single MongoDB host can have multiple databases. Collections and data are associated with a database. The same applies for Postgres.

When applications in [Beehive]({{ site.base_url }}{% post_url 2018-03-20-infra %}) request a MongoDB resource, a connection string URI[^3] is made available as an environment variable for each instance. These connection strings specify different databases for each deployment to prevent deployments from interfering with each other. This is allows us to deploy the same application multiple times for simultaneous events (hosting registration for 2 events at a time) and keeping testing auto-deployments made by pull requests separate from interfering with production data and vice versa.

[^3]: MongoDB connection string/URI documentation: [https://docs.mongodb.com/manual/reference/connection-string/](https://docs.mongodb.com/manual/reference/connection-string/)

{% render_image pg_initalaser2.jpg | Accurate representation of our deployment system %}

Because MongoDB will automatically create a database if one does not already exist during a connection request, no additional steps are required. Beehive merely generates a unique-ish database name for each deployment, appends it to the host portion of a MongoDB connection string and then makes the URI available in the environment variables in production[^4].

[^4]: [https://github.com/HackGT/biodomes/blob/218ac134a09164e87f33ab08443762e85b10bd7c/.travis.d/templates/deployment.yaml.erb#L24](https://github.com/HackGT/biodomes/blob/218ac134a09164e87f33ab08443762e85b10bd7c/.travis.d/templates/deployment.yaml.erb#L24)

## The Problem

This does not work for Postgres.

Due to preference and learning opportunities and other forgotten, arbitrary reasons, we decided to use Postgres for [SponsorshipPortal](https://github.com/HackGT/SponsorshipPortal). But the same magic connection string generation logic in Beehive does not work for Postgres. This is because Postgres requires that databases already exist prior to establishing a connection. Connections made to non-existent databases on a given host will fail.

We wanted to keep the database-level separation at the infrastructure level rather than use schema-level separation because that would require additional (potentially buggy) application-level logic. This strategy would also keep our support for all two(!) datastores more consistent for the application developer.

## The Solution

Introducing [pg_initialaser](https://github.com/HackGT/pg_initialaser).

{% render_image pg_initalaser.png %}

We have a relatively simple problem to solve. A database needs to be created in Postgres before the application can be initialized and created. This must happen or else the container will enter a crash/backoff loop which ~~routinely~~ occassionally floods our #devops-onfire Slack channel.

Beehive uses Kubernetes (k8s) which formally adopted [Init Containers](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/) in version 1.6. pg_initalaser is a very simple Init Container which creates a specified database (and a user) in Postgres before the app’s container is run. If a database or user already exists the container will fail silently, stop and allow the application to run.

When an application requests Postgres from Beehive, pg_initalaser is added as an Init Container in the app’s `deployment.yaml` in Kubernetes in order to create the database needed. Now, connection string logic[^5] analogous to our support for MongoDB will work for Postgres as well. The configuration for application developers remains the same but Beehive now supports Postgres!

[^5]: [https://github.com/HackGT/biodomes/blob/c277475436b5e82610cbdc31959bf32f289c1c2a/.travis.d/templates/deployment.yaml.erb#L43](https://github.com/HackGT/biodomes/blob/c277475436b5e82610cbdc31959bf32f289c1c2a/.travis.d/templates/deployment.yaml.erb#L43)

Check out [pg_initialaser](https://github.com/HackGT/pg_initialaser) and [Beehive](https://github.com/HackGT/biodomes) on [Github](https://github.com/HackGT), follow HackGT on [Facebook](https://facebook.com/HackGT), [Twitter](https://twitter.com/TheHackGT), [Instagram](https://instagram.com/thehackgt), checkout our other [projects](https://hack.gt/code/), and stay tuned for info about HackGT 5 registration!

---

Author’s Note: Yes, the logic for pg_initalaser is only 2 lines long. Yes, much more time was spent learning and implementing the (straightforward) Init Container logic. Yes, even more time was spent coming up with a “clever” name for this project.
