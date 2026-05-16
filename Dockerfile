FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci
RUN npm ci --prefix client
RUN npm ci --prefix server

COPY client ./client
RUN npm run build --prefix client

COPY server ./server

EXPOSE 3000

CMD ["node", "server/index.js"]