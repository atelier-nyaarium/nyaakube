import { createPromise } from "@/assets/common";
import { UnauthorizedError } from "@/assets/common/ErrorTypes";
import { getEnv, respondError } from "@/assets/server";
import session from "express-session";
import { IncomingMessage, ServerResponse } from "http";
import JSON5 from "json5";
import _ from "lodash";
import { v4 as uuid } from "uuid";

const DEV = process.env.NODE_ENV !== "production";

const handlerSession = session({
	secret: getEnv("SESSION_SECRET") || uuid(),
	resave: false,
	saveUninitialized: true,
	cookie: {
		//
		secure: !DEV,
	},
});

/**
 * Creates an API handler function that can be used with Express.js.
 *
 * `req.data` is added to the request. It contains the parsed query, body, and headers.data.
 *
 * `req.attachSession` is added to the request. Use it to begin/resume a session in authentication routes.
 *
 * @param {string} [options.label="(anonymous)"] - A label for the API handler. Recommend to set it to: __filename
 * @param {boolean} [options.log=true] - Whether to console.log the API handler.
 * @param {boolean} [options.useSession=false] - Whether to require a session handler.
 * @param {function} options.handler - The API handler function.
 *
 * @returns {Function} - An Express.js middleware function that handles API requests.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * export default createApiHandler({
 *     label: __filename,
 * 	   log: true,
 * 	   useSession: false,
 *     handler: async (req, res) => {
 *         return respondJson(req, res, { foo: "bar" });
 *     },
 * });
 */
export function createApiHandler({
	label = "(anonymous)",
	log = true,
	useSession = false,
	handler,
}) {
	if (typeof label !== "string") {
		throw new TypeError(
			`createApiHandler({ label?, log?, useSession?, handler }) : 'label' is optional, but must be a string.`,
		);
	}

	if (typeof log !== "boolean") {
		throw new TypeError(
			`createApiHandler({ label?, log?, useSession?, handler }) : 'log' is optional, but must be a boolean.`,
		);
	}

	if (typeof useSession !== "boolean") {
		throw new TypeError(
			`createApiHandler({ label?, log?, useSession?, handler }) : 'useSession' is optional, but must be a boolean.`,
		);
	}

	if (typeof handler !== "function") {
		throw new TypeError(
			`createApiHandler({ label?, log?, useSession?, handler }) : 'handler' must be a function.`,
		);
	}

	if (log) {
		label = label.replace(/^.+?\/\.next\/server\/pages\//, "");
	}

	const attachSession = async (req, res) => {
		if (!(req instanceof IncomingMessage)) {
			throw new TypeError(
				`attachSession(req, res) : 'req' must be an express request.`,
			);
		}

		if (!(res instanceof ServerResponse)) {
			throw new TypeError(
				`attachSession(req, res) : 'res' must be an express response.`,
			);
		}

		const pr = createPromise();
		handlerSession(req, res, () => pr.resolve());
		await pr.promise;
	};

	return async function apiHandler(req, res) {
		let timeStart;
		let logLabel = label;
		if (log) {
			if (req.data?.path) {
				logLabel = label + `  :  ${req.data.path}  `;
			}

			timeStart = new Date();
		}

		try {
			// Stuff query & body into req.data
			safeParseRequestData(req);
		} catch (error) {
			if (log) timedLog(timeStart, `🚫 `, logLabel);

			return await respondError(req, res, `Error parsing user data`, 400);
		}

		try {
			// For deferred session loading
			req.attachSession = attachSession;

			// Load user session if provided
			if (req.cookies["connect.sid"]) {
				await attachSession(req, res);
			}

			if (useSession) {
				if (!req.session?.user) throw new UnauthorizedError();

				await handler(req, res);
			} else {
				await handler(req, res);
			}

			if (log) timedLog(timeStart, `⚡ `, logLabel);
		} catch (error) {
			if (log) timedLog(timeStart, `🚫 `, logLabel);

			return await respondError(req, res, error);
		}
	};
}

/**
 * Logs a message and time difference between startTime and now.
 *
 * @param {Date} timeStart - The start time to calculate the time difference from.
 *
 * @param {...any} message - The message(s) to log.
 */
function timedLog(timeStart, ...message) {
	const timeEnd = new Date();
	const timeDiffSec = (timeEnd - timeStart) / 1000;
	console.log(...message, `:`, timeDiffSec, `s`);
}

/**
 * Parses and merges request data onto `req.data`.
 *
 * Data comes from in priority:
 * 1. req.body
 * 2. req.query
 * 3. req.headers.data
 *
 * `req.query` and `req.body` will be deleted from `req`.
 *
 * @param {IncomingMessage} req - The express request object.
 */
function safeParseRequestData(req) {
	const query = structuredClone(req.query);
	const body = structuredClone(parseJSON(req.body));
	const headers = structuredClone(parseJSON(req.headers.data));

	delete req.query;
	delete req.body;

	req.data = _.merge({}, query, headers, body);
}

/**
 * Parse a string as JSON5.
 *
 * @param {string|object} str - The string to be parsed.
 *
 * @returns {object|undefined} - JSON object
 */
function parseJSON(str) {
	if (typeof str === "object") {
		// Already parsed by body-parser
		return str;
	}

	if (typeof str !== "string" || !str.trim()) {
		return undefined;
	}

	try {
		return JSON5.parse(str);
	} catch (error) {
		console.log(`⛔ `, `Error parsing JSON5`);
		console.error(error);
		return undefined;
	}
}
