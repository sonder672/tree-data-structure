FROM node:18

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

RUN npm install -g pm2

RUN chmod +x /usr/src/app/start.sh

CMD ["/usr/src/app/start.sh"]