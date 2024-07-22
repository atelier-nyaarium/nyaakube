/**
 * Decodes a query string into an object. Starting "?" are auto-trimmed. Empty pair values are omitted.
 *
 * @param str - The query string to decode.
 *
 * @returns An object containing key-value pairs from the query string.
 *
 * @throws TypeError If the parameter types are incorrect.
 *
 * @example
 * const query = decodeQueryString("?foo=bar");
 * -> { foo: "bar" }
 */
export function decodeQueryString(str: string): Record<string, string> {
	if (typeof str !== "string") {
		throw new TypeError("decodeQueryString(str) : 'str' must be a string.");
	}

	const query: Record<string, string> = {};

	if (!str) return query;

	if (str.charAt(0) === "?") str = str.substring(1);

	if (!str.length) return query;

	str.split("&").forEach((str) => {
		const pair = str.split("=");
		if (pair.length > 2) {
			throw new Error("Query string is not well-formed");
		}

		const k = decodeURIComponent(pair[0]);
		const v = decodeURIComponent(pair[1]);

		if (v) query[k] = v;
	});

	return query;
}
