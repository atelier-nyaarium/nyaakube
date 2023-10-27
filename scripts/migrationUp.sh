#!/usr/bin/env sh

ls -hal

npx ts-node ./node_modules/typeorm/cli.js \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"

