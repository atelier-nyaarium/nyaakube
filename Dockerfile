FROM node:20-alpine AS BUILDER
WORKDIR /app

ENV NODE_ENV=production

# React security setting
ENV INLINE_RUNTIME_CHUNK=false

# Build node_modules first
COPY package*.json ./
RUN npm ci --include=dev

# Build project
COPY . .

RUN npx next telemetry disable && npm run build


FROM node:20-alpine as RUNNER_PACKAGES
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev


FROM node:20-alpine AS RUNNER
WORKDIR /app

ENV NODE_ENV=production

ARG PORT=80
ENV PORT=$PORT
ENV APP_PATH=/app
ENV DATA_PATH=/data

COPY --from=RUNNER_PACKAGES /app/node_modules/ node_modules/
COPY --from=BUILDER /app/.next/ .next/
COPY --from=BUILDER /app/server.js .

CMD node server.js

EXPOSE 80
