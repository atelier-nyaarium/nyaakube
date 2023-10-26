import {
	AccessDeniedError,
	TooManyRequestsError,
	UnauthorizedError,
} from "@/assets/common/ErrorTypes";
import { IncomingMessage as ServerRequest, ServerResponse } from "http";

/**
 * Respond with error and status
 *
 * @param {ServerRequest} req - The Express.js request object.
 * @param {ServerResponse} res - The Express.js response object.
 * @param {Error|string} error - The error to send.
 * @param {number} [status=500] - The status code to send.
 * @param {boolean} [logError=true] - Whether to console log the error.
 *
 * @returns {ServerResponse} - The Express.js response object.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * return respondError(req, res, "Error message here");
 */
export function respondError(req, res, error, status, logError) {
	if (!(req instanceof ServerRequest)) {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'req' must be a ServerRequest.`,
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

	if (status === undefined) status = 500;

	if (typeof status !== "number") {
		throw new TypeError(
			`respondError(req, res, error, status?, logError?) : 'status' is optional, but must be a number.`,
		);
	}

	if (logError === undefined) logError = true;

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

		if (status === 401 || error instanceof UnauthorizedError) {
			return res.status(401).json({
				message,
			});
		} else if (status === 403 || error instanceof AccessDeniedError) {
			return res.status(403).json({
				message,
			});
		} else if (status === 429 || error instanceof TooManyRequestsError) {
			return res.status(429).json({
				message,
			});
		} else {
			return res.status(error.status ?? status ?? 500).json({
				message,
			});
		}
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
