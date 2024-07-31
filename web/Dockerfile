FROM node:20 AS build

WORKDIR /src
COPY ./ /src/

RUN --mount=type=cache,target=/src/node_modules \
    yarn install

RUN --mount=type=cache,target=/src/node_modules \
    yarn build

FROM nginx:1.27

COPY ./nginx/default.conf /etc/nginx/conf.d/

COPY --from=build /src/out/ /usr/share/nginx/html/
