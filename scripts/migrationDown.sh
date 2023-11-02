#!/bin/bash
set -e

scripts/loadEnv.sh \
    npx ts-node ./node_modules/typeorm/cli.js \
	migration:revert \
	-d "./src/typeorm/cliDataSource.ts"
