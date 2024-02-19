FROM node:20-alpine3.19
RUN npm install -g @angular/cli
COPY . /app
WORKDIR /app
CMD ng serve --host 0.0.0.0 --port 4200 --disable-host-check
