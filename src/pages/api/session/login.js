import {
	assertValidLogin,
	createApiHandler,
	respondJson,
} from "@/assets/server";

export default createApiHandler({
	label: __filename,
	handler: async (req, res) => {
		const { email, password, totp } = req.data;

		const user = await assertValidLogin(email, password, totp);

		await req.attachSession(req, res);

		req.session.user = user;

		await req.session.save();

		return respondJson(res, { test: req?.session });
	},
});
