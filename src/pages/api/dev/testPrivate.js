import { createApiHandler, respondJson } from "@/assets/server";

export default createApiHandler({
	label: __filename,
	useSession: true,
	handler: (req, res) => {
		return respondJson(res, {
			foo: 42,
			test: req?.session,
		});
	},
});
