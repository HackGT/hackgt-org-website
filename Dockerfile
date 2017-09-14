FROM nginx:alpine

EXPOSE 8080
COPY docker_resources/default.conf /etc/nginx/conf.d/default.conf
COPY _site/ /usr/share/nginx/html/