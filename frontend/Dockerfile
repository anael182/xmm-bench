FROM node:current as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/build /usr/share/nginx/html
EXPOSE 80

CMD find /usr/share/nginx/html -name '*js' -exec sed -i "s|%%DOCKER_BACKEND%%|${DOCKER_BACKEND}|g" {} \; && nginx -g "daemon off;"
