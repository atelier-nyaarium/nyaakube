FROM node:21-alpine AS BUILDER
WORKDIR /app

ENV NODE_ENV=production

# React security setting
ENV INLINE_RUNTIME_CHUNK=false

RUN npm config set update-notifier false

# Build node_modules first
COPY package*.json ./
RUN npm ci --include=dev

# Build project
COPY . .
RUN rm -rf src/pages/dev/ src/pages/api/dev/
RUN npx next telemetry disable \
	&& npm run lint \
	&& npm run test \
	&& npm run build

# Next Standalone
RUN mkdir -p deployment/
RUN cp -R .next/ deployment/
RUN cp -R .next/standalone/* deployment/
RUN rm -rf deployment/.next/standalone/
RUN cp -R public/ deployment/   || true
RUN cp next.config.js deployment/
RUN cp package*.json deployment/



FROM node:21-alpine as MIGRATION_RUNNER
WORKDIR /app

ENV NODE_ENV=production

RUN npm config set update-notifier false

COPY package*.json ./
RUN npm ci --omit=dev

# Scripts
COPY scripts/ scripts/
RUN chmod +x scripts/*.sh

# TypeORM
COPY src/typeorm/ src/typeorm/
COPY tsconfig.json ./



FROM node:21-alpine AS RUNNER
WORKDIR /app

ENV NODE_ENV=production

ARG PORT=80
ENV PORT=$PORT
ENV APP_PATH=/app
ENV DATA_PATH=/data

EXPOSE $PORT

RUN apk add bash \
	&& npm config set update-notifier false

COPY --from=BUILDER /app/deployment/ ./
COPY --from=MIGRATION_RUNNER /app/ migration/

CMD echo "🛠️  Starting TypeORM migration" \
	&& cd "migration" && scripts/migrationUp.sh && cd .. && rm -rf migration \
	&& echo "🛠️  Starting node process" \
	&& node server.js
