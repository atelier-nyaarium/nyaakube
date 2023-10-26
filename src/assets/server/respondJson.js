import { ServerResponse } from "http";

/**
 * Respond with JSON and status
 *
 * @param {ServerResponse} res - The Express.js response object.
 * @param {Object} data - The JSON data to send.
 * @param {number} [status=200] - The status code to send.
 *
 * @returns {ServerResponse} - The response object.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * return respondJson(res, { foo: "bar" });
 */
export function respondJson(res, data, status = 200) {
	if (!(res instanceof ServerResponse)) {
		throw new TypeError(
			`respondJson(res, data, status?) : 'res' must be a ServerResponse.`,
		);
	}

	if (typeof data !== "object" || data === null) {
		throw new TypeError(
			`respondJson(res, data, status?) : 'data' must be an object.`,
		);
	}

	if (typeof status !== "number") {
		throw new TypeError(
			`respondJson(res, data, status?) : 'status' is optional, but must be a number.`,
		);
	}

	data = JSON.stringify(data);
	return res
		.setHeader("content-length", Buffer.byteLength(data))
		.status(status)
		.send(data);
}
