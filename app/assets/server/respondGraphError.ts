import {
	Request as ExpressRequest,
	Response as ExpressResponse,
} from "express";
import { GraphQLError } from "graphql";
import { IncomingMessage as ServerRequest, ServerResponse } from "http";
import { respondError } from "~/assets/server/respondError";

export const DEV = process.env.NODE_ENV === "development";

/**
 * Handles errors that occur during GraphQL execution and respondError.
 *
 * - Client will get a generic message.
 * - Server log will have the full error.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param errors - An array of GraphQL errors.
 *
 * @returns The response object.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const result = await runGraph({
 *     schema,
 *     context: { api },
 *     source,
 * });
 * return respondGraphError(req, res, result.errors);
 */
export function respondGraphError(
	req: ExpressRequest,
	res: ExpressResponse,
	errors: GraphQLError[],
): ExpressResponse {
	if (!(req instanceof ServerRequest)) {
		throw new TypeError(
			`respondGraphError(req, res, errors) : 'req' must be a ServerRequest.`,
		);
	}

	if (!(res instanceof ServerResponse)) {
		throw new TypeError(
			`respondGraphError(req, res, errors) : 'res' must be a ServerResponse.`,
		);
	}

	if (!Array.isArray(errors) || !(errors[0] instanceof GraphQLError)) {
		throw new TypeError(
			`respondGraphError(req, res, errors) : 'errors' must be an array of GraphQL errors.`,
		);
	}

	const { source } = req.body;

	let shortenedQuery: string;
	if (DEV) {
		shortenedQuery = source.trim();
	} else {
		shortenedQuery = `<base64> ` + Buffer.from(source).toString("base64");
	}

	let clientErrorMessage = `GraphQL failed to execute. Check server logs for details.`;

	const regexCode = /^\[([\d]+)\] /;

	errors.forEach((error) => {
		let line = error.message;
		const match = line.match(regexCode);
		if (match) {
			const code = match[1];
			line = line.replace(regexCode, "");
			switch (code) {
				case "401":
				case "403":
					// Display authentication errors to the user.
					clientErrorMessage = line;
					break;
				default:
					// Generic errors for the rest.
					clientErrorMessage = `${line}`;
			}
		}

		let loc = ``;
		if (error.locations?.[0]) {
			loc = ` (${error.locations[0].line}:${error.locations[0].column})`;
		}
		console.log(`⚠️ `, `GraphQL${loc}: ${shortenedQuery}`);
	});

	return respondError(req, res, clientErrorMessage, undefined, false);
}
