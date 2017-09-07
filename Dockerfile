FROM nginx:alpine

RUN cp -r _site/* /usr/share/nginx/html/