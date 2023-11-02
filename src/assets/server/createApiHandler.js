import { UnauthorizedError } from "@/assets/common/ErrorTypes";
import { createPromise } from "@/assets/common/createPromise";
import { getEnv } from "@/assets/server/getEnv";
import { respondError } from "@/assets/server/respondError";
import { createPostgresUrl } from "@/typeorm/PostgresDataSource";
import pgSession from "connect-pg-simple";
import session from "express-session";
import JSON5 from "json5";
import _ from "lodash";

const DEV = process.env.NODE_ENV !== "production";

const pgStore = pgSession(session);

const handlerSession = session({
	secret: getEnv("SESSION_SECRET"),
	resave: false,
	saveUninitialized: false,
	store: new pgStore({
		conString: createPostgresUrl(),
	}),
	cookie: {
		maxAge: 24 * 60 * 60 * 1000,
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		secure: !DEV,
		sameSite: !DEV ? "strict" : "lax",
	},
});

/**
 * Creates an API handler function that can be used with Express.js.
 *
 * `req.data` is added to the request. It contains the parsed query, body, and headers.data.
 *
 * `req.attachSession` is added to the request. Use it to begin/resume a session in authentication routes.
 *
 * @typedef {import("http").IncomingMessage} ServerRequest - The Express.js request object.
 * @typedef {import("http").ServerResponse} ServerResponse - The Express.js response object.
 *
 * @typedef {Object} ApiHandlerOptions
 * @property {string} [label="(anonymous)"] - A label for the API handler. Recommend to set it to: __filename
 * @property {boolean} [log=true] - Whether to console.log the API handler.
 * @property {boolean} [useSession=false] - Whether to require a session handler.
 * @property {function(ServerRequest, ServerResponse): void} handler - The API handler function.
 *
 * @param {ApiHandlerOptions} options - The options for the API handler.
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

	return async function apiHandler(req, res) {
		// TODO: Dockerfile grab this list:
		//   npm i -D ip6
		// https://www.cloudflare.com/ips-v4
		// https://www.cloudflare.com/ips-v6

		const host = req.headers.host;
		const cfConnectingIp = req.headers["cf-connecting-ip"];
		const remoteIp = req.connection.remoteAddress;
		if (cfConnectingIp) {
			console.log(
				` ℹ️ CloudFlare connection  ${cfConnectingIp}  ( ${remoteIp} ) intended for ${host}`,
			);
		} else {
			console.log(
				` ℹ️ Direct connection  ${remoteIp}  intended for ${host}`,
			);
		}

		let timeStart;
		let logLabel = label;
		if (log) {
			if (req.data?.path) {
				logLabel = label + `  :  ${req.data.path}  `;
			}

			timeStart = new Date().getTime();
		}

		try {
			// Stuff query & body into req.data
			safeParseRequestData(req);
		} catch (error) {
			if (log) timedLog(timeStart, `🚫`, logLabel);

			return await respondError(req, res, `Error parsing user data`, 400);
		}

		try {
			// Provide Express Session on req.session
			// With `saveUninitialized: false`, no cookies will be created until `req.session` is used.
			const pr = createPromise();
			handlerSession(req, res, () => pr.resolve());
			await pr.promise;

			// Call passed in handler
			if (useSession) {
				if (!req.session?.user) throw new UnauthorizedError();

				await handler(req, res);
			} else {
				await handler(req, res);
			}

			if (log) timedLog(timeStart, `⚡`, logLabel);
		} catch (error) {
			if (log) timedLog(timeStart, `🚫`, logLabel);

			return await respondError(req, res, error);
		}
	};
}

/**
 * Logs a message and time difference between startTime and now.
 *
 * @param {number} timeStart - The start time to calculate the time difference from.
 *
 * @param {...any} message - The message(s) to log.
 */
function timedLog(timeStart, ...message) {
	const timeEnd = new Date().getTime();
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
 * Data is cloned using `structuredClone` to strip any weird prototype stuff a malicious actor might try.
 *
 * `req.query` and `req.body` will be deleted from `req` for safety from accidental usage.
 *
 * @param {http.IncomingMessage} req - The express request object.
 */
function safeParseRequestData(req) {
	const query = req.query;
	const body = parseJSON5(req.body);
	const headerData = parseJSON5(req.headers.data || req.headers.Data);

	const mergedData = _.merge({}, query, headerData, body);

	req.data = structuredClone(mergedData);

	delete req.query;
	delete req.body;
}

/**
 * Parse a string as JSON5.
 *
 * @param {string|object} str - The string to be parsed.
 *
 * @returns {object|undefined} - JSON object
 */
function parseJSON5(str) {
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
