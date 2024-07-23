import { Response as ExpressResponse } from "express";
import { ServerResponse } from "http";

/**
 * Respond with JSON and status
 *
 * @param res - The Express.js response object.
 * @param data - The JSON data to send.
 * @param status - The status code to send. Defaults to 200.
 *
 * @returns The response object.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * return respondJson(res, { foo: "bar" });
 */
// export
function respondJson(
	res: ExpressResponse,
	data: Record<string, unknown>,
	status: number = 200,
): ExpressResponse {
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

	const jsonData = JSON.stringify(data);
	return res
		.setHeader("content-length", Buffer.byteLength(jsonData).toString())
		.status(status)
		.send(jsonData);
}
