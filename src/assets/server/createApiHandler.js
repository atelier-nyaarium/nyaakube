import respondError from "@/assets/server/respondError";
import JSON5 from "json5";

export default function createApiHandler({
	label = "(anonymous)",
	time = true,
	log = true,
	// useLogin = false,
	// useTotp = false,
	handler,
}) {
	if (time || log) {
		label = label.replace(/^.+?\/\.next\/server\/pages\//, "");
	}

	return async function apiHandler(req, res) {
		if (typeof label !== "string") {
			throw new Error(`Expected a label string`);
		}
		if (typeof handler !== "function") {
			throw new Error(`Expected a handler function`);
		}

		try {
			const data = Object.assign({}, req.query, parseBody(req.body));
			req.data = data;

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
		throw error;
	}
}
