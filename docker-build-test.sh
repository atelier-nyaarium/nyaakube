
docker build -t test . \
&& docker run \
	-it \
	--rm \
	--env-file .env.local \
	-p 3000:3000 \
	-v ./volume/data:/data \
	test
