#!/usr/bin/env sh

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

npx typeorm-ts-node-esm \
	migration:generate \
	-d "./src/typeorm/cliDataSource.ts" \
	"src/typeorm/migrations/$migrationName"
