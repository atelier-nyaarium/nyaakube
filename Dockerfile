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

RUN mkdir -p .next/standalone/.next/
RUN mv .next/static/ .next/standalone/.next/static/



FROM node:20-alpine AS RUNNER
WORKDIR /app

ENV NODE_ENV=production

ARG PORT=80
ENV PORT=$PORT
ENV APP_PATH=/app
ENV DATA_PATH=/data

# COPY --from=RUNNER_PACKAGES /app/node_modules/ node_modules/
COPY --from=BUILDER /app/.next/ .next/

CMD cd ".next/standalone"; node server.js

EXPOSE 80
