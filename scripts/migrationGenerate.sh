#!/bin/bash
set -e

echo ""
echo " ✏️  Enter the TypeORM migration name:"
read migrationName

# Strip non-alphanumeric characters
migrationName=$(echo "$migrationName" | sed 's/[^a-zA-Z0-9]//g')

# Check if migration name is empty after stripping
if [ -z "$migrationName" ]; then
    echo " ❌  Error: Migration name is required"
    exit 1
fi

scripts/loadEnv.sh \
    npx ts-node ./node_modules/typeorm/cli.js \
	migration:generate \
	-d "./src/typeorm/cliDataSource.ts" \
	"src/typeorm/migrations/$migrationName"
