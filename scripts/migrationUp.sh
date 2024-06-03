#!/bin/bash
set -e

# if not defined, error:
if [ -z "$POSTGRES_DB" ]; then
	echo "Error: POSTGRES_DB variable is missing"
	exit 1
fi
if [ -z "$POSTGRES_HOST" ]; then
	echo "Error: POSTGRES_HOST variable is missing"
	exit 1
fi
if [ -z "$POSTGRES_USER" ]; then
	echo "Error: POSTGRES_USER variable is missing"
	exit 1
fi
if [ -z "$POSTGRES_PASSWORD" ]; then
	echo "Error: POSTGRES_PASSWORD variable is missing"
	exit 1
fi

scripts/loadEnv.sh \
    npx ts-node ./node_modules/typeorm/cli.js \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"
