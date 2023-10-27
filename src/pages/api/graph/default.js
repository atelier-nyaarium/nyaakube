import { runGraph } from "@/assets/common";
import {
	createApiHandler,
	respondGraphError,
	respondJson,
} from "@/assets/server";
import schema from "@/schemas/default";
import ServerAPI from "@/schemas/default/api/ServerAPI";

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
			return respondGraphError(req, res, result.errors);
		} else {
			return respondJson(res, result.data);
		}
	},
});
