FROM node:16-alpine

WORKDIR /api

COPY package.json .
# COPY .env .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
