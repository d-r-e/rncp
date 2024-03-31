FROM node:20-alpine as build

WORKDIR /app
COPY angular .
RUN npm install
RUN npm run build -c production

FROM nginx:stable-alpine
COPY --from=build /app/dist/rncp/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf