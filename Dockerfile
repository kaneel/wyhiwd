FROM node:12.15.0 as builder 
WORKDIR /usr/src/build/
COPY ./package.json .
COPY ./package-lock.json .
COPY ./bundler.js .
COPY ./scripts/ ./scripts
RUN npm i
RUN node bundler.js

FROM nginx:alpine
COPY ./index.html /usr/share/nginx/html
COPY ./style.css /usr/share/nginx/html
COPY ./i/ /usr/share/nginx/html/i
COPY --from=0 /usr/src/build/bundle.js /usr/share/nginx/html

