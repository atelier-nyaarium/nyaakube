const DEV = process.env.NODE_ENV !== "production";
const PORT = process.env.PORT || (DEV ? 3000 : 80);
const ORIGIN = process.env.ORIGIN || `http://localhost:${PORT}`;

(async () => {
	console.log(` ℹ️ `, `startServices.js - Connecting to ${ORIGIN}`);
	for (let i = 0; i < 10; i++) {
		try {
			await fetch(ORIGIN).then((res) => res.status);
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
