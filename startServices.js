console.log(`Top of file`);

const DEV = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || (DEV ? 3000 : 80);
const ORIGIN_SELF = `http://127.0.0.1:${PORT}`;

(async () => {
	console.log(` ℹ️ `, `startServices.js - Connecting to ${ORIGIN_SELF}`);
	for (let i = 0; i < 10; i++) {
		try {
			await fetch(ORIGIN_SELF).then((res) => res.status);
			console.log(` ℹ️ `, `startServices.js - Success`);
			return;
		} catch (error) {
			switch (error.cause.code) {
				case "ECONNREFUSED":
					break;
				case "ECONNRESET":
					break;
				default:
					console.error(error);
					process.exit(1);
			}

			console.log(` ⏳ `, error.cause.code);

			await pause(1000);
		}
	}
})();

function pause(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
