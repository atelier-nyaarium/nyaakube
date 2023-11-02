#!/bin/bash

docker compose down -t 600 --rmi local
docker compose rm -fsv
docker compose up --remove-orphans --no-log-prefix
