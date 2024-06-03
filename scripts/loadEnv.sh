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

which npx
npx -v
npx ts-node -v

npx ts-node <<EOF
console.log("ts-node works");
EOF

echo "$@"
"$@"
