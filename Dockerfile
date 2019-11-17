FROM node:13-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

ENV PORT 8080

CMD [ "npm", "start" ]
