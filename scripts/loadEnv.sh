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
fi

"$@"
