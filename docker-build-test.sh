
docker build -t test . \
&& docker run --rm -it -p 3000:3000 \
	test
