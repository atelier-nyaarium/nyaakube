import {
	assertValidLogin,
	createApiHandler,
	respondError,
	respondJson,
} from "@/assets/server";

export default createApiHandler({
	label: __filename,
	async handler(req, res) {
		const { email, password, totp } = req.data;

		const user = await assertValidLogin(email, password, totp);

		req.session.user = user;

		req.session.save((error) => {
			if (error) {
				return respondError(req, res, error);
			} else {
				return respondJson(res, { ok: true });
			}
		});
	},
});
