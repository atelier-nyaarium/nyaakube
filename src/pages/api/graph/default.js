import { runGraph } from "@/assets/common";
import { createApiHandler, respondError, respondJson } from "@/assets/server";
import schema from "@/schemas/default";
import ServerAPI from "@/schemas/default/api/ServerAPI";

const DEV = process.env.NODE_ENV === "development";

const api = new ServerAPI();

export default createApiHandler({
	label: __filename,
	handler: async (req, res) => {
		const { source } = req.data;

		if (typeof source !== "string") {
			throw new TypeError(
				`graph({ source }) : 'source' must be a string.`,
			);
		}

		const result = await runGraph({
			schema,
			context: { api },
			source,
		});
		if (result.errors) {
			let shortenedQuery;
			if (DEV) {
				shortenedQuery = source.trim();
			} else {
				shortenedQuery =
					`<base64> ` + Buffer.from(source).toString("base64");
			}

			const errorList = result.errors
				.map((err) => `   - ${err.message}`)
				.join("\n");

			console.log(`⚠️ `, `GraphQL: ${shortenedQuery}\n${errorList}`);

			return respondError(req, res, `GraphQL failed to execute.`);
		} else {
			return respondJson(res, result.data);
		}
	},
});
