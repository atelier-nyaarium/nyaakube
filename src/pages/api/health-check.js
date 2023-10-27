let firstRun = true;

export default async function handler(req, res) {
	if (firstRun) {
		firstRun = false;

		// BROKEN: Initialize the ServerAPI
		// new ServerAPI();

		// console.log(` ℹ️ `, `Starting up services`);

		// TODO: Some init code would go here. If there were any.

		// console.log(` ℹ️ `, `Services are ready`);
	}

	res.setHeader("Content-Type", "text/plain");
	res.end("ok");
}
