import ServerAPI from "@/schemas/default/api/ServerAPI";

let firstRun = true;

export default async function handler(req, res) {
	if (firstRun) {
		firstRun = false;

		new ServerAPI();

		// console.log(` ℹ️ `, `Starting up services`);

		// TODO: Some init code would go here. If there were any.

		// console.log(` ℹ️ `, `Services are ready`);
	}

	res.setHeader("Content-Type", "text/plain");
	res.end("ok");
}
