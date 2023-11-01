#!/bin/bash
set -e

docker build -t test .

docker run \
	-it \
	--rm \
	--env-file .env.shell \
	--env-file .env.shell.docker \
	-p 3000:3000 \
	-v ./volume/data:/data \
	test /bin/sh
