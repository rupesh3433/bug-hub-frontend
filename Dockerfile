# stage 1 building process
FROM node:22-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

RUN npm run build

# stage 2 running
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx" ,"-g","daemon off;" ]
