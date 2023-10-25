import { createApiHandler, respondJson } from "@/assets/server";

export default createApiHandler({
	label: __filename,
	handler(req, res) {
		const session = req.session;
		const user = session?.user;
		const roles = user?.roles;

		if (roles) {
			return respondJson(res, {
				valid: !!session,
				roles,
			});
		} else {
			return respondJson(res, {
				valid: false,
			});
		}
	},
});
