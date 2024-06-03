#!/bin/bash
set -e

if [ -f ".env.shell" ]; then
    echo " ℹ️ .env.shell found. Loading variables."
    while IFS= read -r line
    do
        if [[ ! "$line" =~ ^\# && "$line" != "" ]]; then
            export $line
        fi
    done < .env.shell
else
    echo ".env.shell not found. Skipping."
fi

ls ./node_modules/typeorm/

ls ./node_modules/ts-node/

ls ./src/typeorm/

which npx
npx -v

echo "$@"
"$@"
