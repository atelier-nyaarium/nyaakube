#!/usr/bin/env sh

npx typeorm-ts-node-esm \
	migration:revert \
	-d "./src/typeorm/cliDataSource.ts"
