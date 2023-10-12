import cloneDeepOmitProto from "@/assets/common/cloneDeepOmitProto";
import respondError from "@/assets/server/respondError";
import JSON5 from "json5";
import _ from "lodash";

/**
 * Creates an API handler function that can be used with Express.js.
 *
 * @param {string} [options.label="(anonymous)"] - A label for the API handler. Recommend to set it to: __filename
 * @param {boolean} [options.time=true] - Whether to console.time the API handler.
 * @param {boolean} [options.log=true] - Whether to console.log the API handler.
 * @param {function} options.handler - The API handler function.
 *
 * @returns {Function} - An Express.js middleware function that handles API requests.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * export default createApiHandler({
 *     label: __filename,
 *     handler: async (req, res) => {
 *         return respondJson(req, res, { foo: "bar" });
 *     },
 * });
 */
export default function createApiHandler({
	label = "(anonymous)",
	time = true,
	log = true,
	// useLogin = false,
	// useTotp = false,
	handler,
}) {
	if (typeof label !== "string") {
		throw new TypeError(
			`createApiHandler({ label?, time?, log?, handler }) : 'label' is optional, but must be a string.`,
		);
	}

	if (typeof time !== "boolean") {
		throw new TypeError(
			`createApiHandler({ label?, time?, log?, handler }) : 'time' is optional, but must be a boolean.`,
		);
	}

	if (typeof log !== "boolean") {
		throw new TypeError(
			`createApiHandler({ label?, time?, log?, handler }) : 'log' is optional, but must be a boolean.`,
		);
	}

	if (typeof handler !== "function") {
		throw new TypeError(
			`createApiHandler({ label?, time?, log?, handler }) : 'handler' must be a function.`,
		);
	}

	if (time || log) {
		label = label.replace(/^.+?\/\.next\/server\/pages\//, "");
	}

	return async function apiHandler(req, res) {
		try {
			// Stuff query & body into req.data
			safeParseRequestData(req);

			let logLabel = label;
			if (time || log) {
				if (req.data?.path) {
					logLabel = label + `  :  ${req.data.path}  `;
				}
			}
			if (time) console.time(`⚡  ${logLabel}`);
			else if (log) console.log(`⚡ `, logLabel);

			try {
				await handler(req, res);
			} catch (error) {
				await respondError(req, res, error);
			}

			if (time) console.timeEnd(`⚡  ${logLabel}`);
		} catch (error) {
			await respondError(req, res, `Error parsing user data`, 400);
		}
	};
}

function safeParseRequestData(req) {
	const query = cloneDeepOmitProto(req.query);
	const body = cloneDeepOmitProto(parseBody(req.body));

	delete req.query;
	delete req.body;

	req.data = _.merge({}, query, body);
	return req.data;
}

function parseBody(raw) {
	if (typeof raw === "object") {
		// Already parsed by body-parser
		return raw;
	}

	if (typeof raw !== "string" || !raw.trim()) {
		return undefined;
	}

	try {
		return JSON5.parse(raw);
	} catch (error) {
		console.log(`⛔ `, `Error parsing JSON`);
		console.error(error);
		return undefined;
	}
}
