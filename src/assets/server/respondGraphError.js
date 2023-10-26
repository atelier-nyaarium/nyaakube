import { respondError } from "@/assets/server/respondError";
import { GraphQLError } from "graphql";
import { IncomingMessage as ServerRequest, ServerResponse } from "http";

export const DEV = process.env.NODE_ENV === "development";

/**
 * Handles errors that occur during GraphQL execution and respondError.
 *
 * - Client will get a generic message.
 * - Server log will have the full error.
 *
 * @param {ServerRequest} req - The Express.js request object.
 * @param {ServerResponse} res - The Express.js response object.
 * @param {GraphQLError[]} errors - An array of GraphQL errors.
 *
 * @returns {ServerResponse} - The response object.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const result = await runGraph({
 *     schema,
 *     context: { api },
 *     source,
 * });
 * return respondGraphError(req, res, result.errors);
 */
export function respondGraphError(req, res, errors) {
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

	if (!Array.isArray(errors) && !(errors?.[0] instanceof GraphQLError)) {
		throw new TypeError(
			`respondGraphError(req, res, errors) : 'errors' must be an array of GraphQL errors.`,
		);
	}

	const { source } = req.data;

	let shortenedQuery;
	if (DEV) {
		shortenedQuery = source.trim();
	} else {
		shortenedQuery = `<base64> ` + Buffer.from(source).toString("base64");
	}

	let clientErrorMessage = `GraphQL failed to execute. Check server logs for details.`;

	const regexCode = /^\[([\d]+)\] /;

	errors.forEach((error) => {
		let line = error.message;
		if (regexCode.test(line)) {
			const code = line.match(regexCode)[1];
			line = line.replace(regexCode, "");
			switch (code) {
				case "401":
				case "403":
					// Display authentication errors to the user.
					clientErrorMessage = line;
					break;
				default:
				// Generic errors for the rest.
			}
		}

		// Show only 1 message to the user.
		clientErrorMessage = `${line}`;

		let loc = ``;
		if (error.locations?.[0]) {
			loc = ` (${error.locations[0].line}:${error.locations[0].column})`;
		}
		console.log(`⚠️ `, `GraphQL${loc}: ${shortenedQuery}`);
	});

	return respondError(req, res, clientErrorMessage, void 0, false);
}
