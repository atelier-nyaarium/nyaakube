import { createApiHandler, respondJson } from "@/assets/server";

export default createApiHandler({
	label: __filename,
	handler: (req, res) => {
		const session = req.session;

		return respondJson(res, {
			valid: !!session,
			roles: session?.roles ?? [],
		});
	},
});
