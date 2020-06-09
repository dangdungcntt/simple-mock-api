FROM keymetrics/pm2:12-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ENV NPM_CONFIG_LOGLEVEL warn

RUN npm install --production

COPY . .

VOLUME ["/usr/src/app/storage"]

EXPOSE 3406

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production"]
