FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm ci
RUN npm ci --prefix client
RUN npm ci --prefix server

# Build args for Vite (must be set at build time)
ARG VITE_MAX_LINE_LENGTH
ARG VITE_MAX_LINES
ARG VITE_SHRINK_DURATION
ARG VITE_NEW_CAST_SIZE_MULT
ARG VITE_INITIAL_ZOOM
ARG VITE_IDLE_TIMEOUT
ARG VITE_INPUT_PLACEHOLDER

COPY client ./client
RUN npm run build --prefix client

COPY server ./server

EXPOSE 3000

CMD ["node", "server/index.js"]