import {
	Request as ExpressRequest,
	Response as ExpressResponse,
} from "express";
import { IncomingMessage, ServerResponse } from "http";
import {
	AccessDeniedError,
	TooManyRequestsError,
	UnauthorizedError,
} from "~/assets/ErrorTypes";

/**
 * Respond with error and status
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param error - The error to send.
 * @param status - The status code to send. Defaults to 500.
 * @param logError - Whether to console log the error. Defaults to true.
 *
 * @returns The Express.js response object.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * return respondError(req, res, "Error message here");
 */
// export
function respondError(
	req: ExpressRequest,
	res: ExpressResponse,
	error: Error | string,
	status: number = 500,
	logError: boolean = true,
): ExpressResponse {
	if (!(req instanceof IncomingMessage)) {
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

	let message: string;

	if (error instanceof Error && error.message) {
		message = error.message;
	} else if (typeof error === "string") {
		message = error;
	} else {
		message = "Unknown error";
	}

	switch ((error as any)?.code) {
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
		console.log(`⚠️ `, message);
	}

	if (error instanceof Error) {
		if (status === 401 || error instanceof UnauthorizedError) {
			return res.status(401).json({ message });
		} else if (status === 403 || error instanceof AccessDeniedError) {
			return res.status(403).json({ message });
		} else if (status === 429 || error instanceof TooManyRequestsError) {
			return res.status(429).json({ message });
		} else {
			return res
				.status((error as any).status ?? status)
				.json({ message });
		}
	} else {
		console.log(`⚠️ `, `Error:`, error);
		return res.status(status).json({ message });
	}
}
