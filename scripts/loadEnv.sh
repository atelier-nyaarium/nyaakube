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

echo "Node version: $(node -v)"

# If ts-node exists, but this command fails, double check you are giving enough memory to the container.
npx ts-node <<EOF
console.log("ts-node version: " + require("ts-node/package.json").version);
EOF

echo "$@"
"$@"
