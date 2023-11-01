#!/bin/bash
set -e

if [ -f ".env.shell" ]; then
    while IFS= read -r line
    do
        if [[ ! "$line" =~ ^\# && "$line" != "" ]]; then
            export $line
        fi
    done < .env.shell
else
    echo ".env.shell file not found"
fi

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

npx ts-node ./node_modules/typeorm/cli.js \
	migration:generate \
	-d "./src/typeorm/cliDataSource.ts" \
	"src/typeorm/migrations/$migrationName"
