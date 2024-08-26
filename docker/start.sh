#!/bin/sh


FROM="/root/data/nyaakube/public/"
TO="public/"


if [ -n "$RSYNC_KEY" ]; then
	echo "$RSYNC_KEY" | base64 -d > temp.key
	unset RSYNC_KEY
	chmod 600 temp.key
	# rsync -arv --del
	# Sync only add on top of public folder
	rsync -arv \
		--chown root:root \
		-e "ssh -o StrictHostKeyChecking=no -i temp.key -p 2222" \
		root@arbiter.nyaarium.com:"$FROM" "$TO"
	rm temp.key

	rm -rf /usr/bin/ssh /usr/bin/scp /usr/bin/rsync
else
	echo "⚠️  RSYNC_KEY is not set. Skipping rsync."
fi


npm run start
