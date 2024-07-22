import { Response as ExpressResponse } from "express";
import { ServerResponse } from "http";

/**
 * Respond with data and status
 *
 * @param res - The Express.js response object.
 * @param data - The data to send.
 * @param status - The status code to send. Defaults to 200.
 *
 * @returns The response object.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * return respondSend(res, "Hello, world!");
 */
export function respondSend(
	res: ExpressResponse,
	data: string,
	status: number = 200,
): ExpressResponse {
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

	const responseData = String(data);
	return res
		.setHeader("content-length", Buffer.byteLength(responseData).toString())
		.status(status)
		.send(responseData);
}
