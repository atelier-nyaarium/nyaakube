import { ServerResponse } from "http";

/**
 * Respond with data and status
 *
 * @param {ServerResponse} res - The Express.js response object.
 * @param {string} data - The data to send.
 * @param {number} [status=200] - The status code to send.
 *
 * @returns {ServerResponse} - The response object.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * return respondSend(res, "Hello, world!");
 */
export function respondSend(res, data, status = 200) {
	if (!(res instanceof ServerResponse)) {
		throw new TypeError(
			`respondSend(res, data, status?) : 'res' must be a ServerResponse.`,
		);
	}

	if (typeof data !== "string") {
		throw new TypeError(
			`respondSend(res, data, status?) : 'data' must be a string.`,
		);
	}

	if (typeof status !== "number") {
		throw new TypeError(
			`respondSend(res, data, status?) : 'status' is optional, but must be a number.`,
		);
	}

	data = String(data);
	return res
		.setHeader("content-length", Buffer.byteLength(data))
		.status(status)
		.send(data);
}
