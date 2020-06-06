FROM node:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

VOLUME ["/usr/src/app/storage"]

EXPOSE 3406

CMD [ "node", "index.js" ]
