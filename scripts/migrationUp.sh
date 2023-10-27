#!/bin/bash

npx typeorm-ts-node-esm \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"
