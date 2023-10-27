#!/usr/bin/env sh

npx typeorm-ts-node-esm \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"
