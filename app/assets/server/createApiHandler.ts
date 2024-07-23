//===================
//
//    UNUSED
//
// Old code from Next.js

import session, { SessionOptions } from "express-session";
import { IncomingMessage, ServerResponse } from "http";
import JSON5 from "json5";
import _ from "lodash";
import MemoryStoreModule from "memorystore";
import { UnauthorizedError } from "~/assets/ErrorTypes";
import { createPromise } from "~/assets/common/createPromise";
import { getEnv } from "~/assets/server/getEnv";
import { respondError } from "~/assets/server/respondError";

const DEV = process.env.NODE_ENV !== "production";

const MemoryStore = MemoryStoreModule(session);

const handlerSession = session({
	secret: getEnv("SESSION_SECRET"),
	resave: false,
	saveUninitialized: false,
	store: new MemoryStore({
		checkPeriod: 1 * 60 * 60 * 1000,
	}),
	cookie: {
		maxAge: 24 * 60 * 60 * 1000,
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
		secure: !DEV,
		sameSite: !DEV ? "strict" : "lax",
	},
} as SessionOptions);

interface ApiHandlerOptions {
	label?: string;
	log?: boolean;
	useSession?: boolean;
	handler: (
		req: IncomingMessage,
		res: ServerResponse,
	) => void | Promise<void>;
}

/**
 * Creates an API handler function that can be used with Express.js.
 *
 * `req.data` is added to the request. It contains the parsed query, body, and headers.data.
 *
 * `req.attachSession` is added to the request. Use it to begin/resume a session in authentication routes.
 *
 * @param options - The options for the API handler.
 *
 * @returns An Express.js middleware function that handles API requests.
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
// export
function createApiHandler({
	label = "(anonymous)",
	log = true,
	useSession = false,
	handler,
}: ApiHandlerOptions) {
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

	return async function apiHandler(
		req: IncomingMessage & {
			session?: any;
			data?: any;
			query?: any;
			body?: any;
		},
		res: ServerResponse,
	) {
		const host = req.headers.host;
		const cfConnectingIp = req.headers["cf-connecting-ip"] as
			| string
			| undefined;
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

		let timeStart: number | undefined;
		let logLabel = label;
		if (log) {
			if (req.data?.path) {
				logLabel += `  :  ${req.data.path}  `;
			}

			timeStart = Date.now();
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
			const pr = createPromise<void>();
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
 * @param timeStart - The start time to calculate the time difference from.
 * @param message - The message(s) to log.
 */
function timedLog(timeStart: number | undefined, ...message: any[]) {
	if (timeStart !== undefined) {
		const timeEnd = Date.now();
		const timeDiffSec = (timeEnd - timeStart) / 1000;
		console.log(...message, `:`, timeDiffSec, `s`);
	}
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
 * @param req - The express request object.
 */
function safeParseRequestData(
	req: IncomingMessage & { data?: any; query?: any; body?: any },
) {
	const query = req.query;
	const body = parseJSON5(req.body);
	const headerData = parseJSON5(
		(req.headers.data as string) || (req.headers.Data as string),
	);

	const mergedData = _.merge({}, query, headerData, body);

	req.data = structuredClone(mergedData);

	delete req.query;
	delete req.body;
}

/**
 * Parse a string as JSON5.
 *
 * @param str - The string to be parsed.
 *
 * @returns JSON object or undefined.
 */
function parseJSON5(str: string | object): object | undefined {
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
