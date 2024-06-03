#!/bin/bash
set -e

echo "Connecting to database $POSTGRES_DB on $POSTGRES_HOST as $POSTGRES_USER..."

scripts/loadEnv.sh \
    npx ts-node ./node_modules/typeorm/cli.js \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"
