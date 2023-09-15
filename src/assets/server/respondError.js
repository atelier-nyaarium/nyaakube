export default function respondError(
	req,
	res,
	error,
	status = 500,
	logError = true,
) {
	let message;

	if (error?.message) {
		message = error?.message;
	}

	if (!message) {
		message = error?.code ?? "Unknown error";
	}

	switch (error?.code) {
		case "ENOENT":
			message = `No such file or directory`;
			break;
		default:
	}

	if (logError) {
		// TODO: stub for logging to database
		// await storeError({
		// 	url: req.url,
		// 	error,
		// 	user: req.user,
		// 	data: req.data,
		// });
	}

	if (error instanceof Error) {
		console.log(`⚠️ `, message);
		return res.status(error.status ?? status ?? 500).json({
			message,
		});
	} else if (typeof error === "string") {
		console.log(`⚠️ `, `Error:`, error);
		return res.status(status ?? 500).json({
			message: error,
		});
	} else {
		console.log(`⚠️ `, message);
		return res.status(status ?? 500).json({
			message,
		});
	}
}
