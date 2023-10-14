import { IncomingMessage, ServerResponse } from "http";

/**
 * Respond with error and status
 *
 * @param {IncomingMessage} req - The request object.
 * @param {ServerResponse} res - The response object.
 * @param {Error|string} error - The error to send.
 * @param {number} [status=500] - The status code to send.
 * @param {boolean} [logError=true] - Whether to console log the error.
 *
 * @returns {ServerResponse} - The response object.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * return respondError(req, res, "Error message here");
 */
export function respondError(req, res, error, status = 500, logError = true) {
	if (!(req instanceof IncomingMessage)) {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'req' must be a IncomingMessage.`,
		);
	}

	if (!(res instanceof ServerResponse)) {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'res' must be a ServerResponse.`,
		);
	}

	if (!(error instanceof Error) && typeof error !== "string") {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'error' must be an Error or a string.`,
		);
	}

	if (typeof status !== "number") {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'status' is optional, but must be a number.`,
		);
	}

	if (typeof logError !== "boolean") {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'logError' is optional, but must be a boolean.`,
		);
	}

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
