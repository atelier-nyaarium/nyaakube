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

npx ts-node ./node_modules/typeorm/cli.js \
	migration:run \
	-d "./src/typeorm/cliDataSource.ts"

