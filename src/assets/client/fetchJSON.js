import _ from "lodash";

/**
 * Fetch [GET|POST] JSON
 *
 * Formats a fetch call to send & accept JSON.
 * Sets the method to POST if a JSON is provided.
 *
 * Response's `res.json`  will contain the JSON response.
 * If the server fails to return a JSON (typically fatal errors), the raw response string will be stuffed in `res.text`.
 *
 * @async
 *
 * @param {string} url - The URL to fetch.
 * @param {Object} [json] - Optional JSON to send.
 * @param {Object} [options] - Optional fetch options.
 *
 * @returns {Promise<{ ok: boolean, status: number, json: JSON, text: string }>}  Promises a response object.
 *
 * @example await fetchJSON(`/api/session/login`, { username, password })
 * .then(async res => {
 *     console.log(res.ok)
 *     console.log(res.status)
 *     console.log(res.json)
 * })
 */
export default async function fetchJSON(url, json, options = {}) {
	if (typeof url !== "string") {
		throw new Error(
			`fetchJSON(url, json?, options?) : 'url' must be a string.`,
		);
	}
	if (json !== undefined && (typeof json !== "object" || json === null)) {
		throw new Error(
			`fetchJSON(url, json?, options?) : 'json' is optional, but must be an object.`,
		);
	}
	if (
		options !== undefined &&
		(typeof options !== "object" || options === null)
	) {
		throw new Error(
			`fetchJSON(url, json?, options?) : 'options' is optional, but must be an object.`,
		);
	}

	const asForm = !!options?.form;

	let fetchData = { ...options };

	if (asForm) {
		fetchData = _.merge(
			{
				method: "post",
			},
			options,
		);
	} else {
		fetchData = _.merge(
			{
				method: typeof json === "undefined" ? "get" : "post",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			},
			options,
		);
	}

	if (asForm) {
		const formData = new FormData();

		Object.entries(json).forEach(([key, value]) => {
			if (value instanceof FileList || Array.isArray(value)) {
				for (const v of value) formData.append(key, v);
			} else {
				formData.append(key, value);
			}
		});

		fetchData.body = formData;
	} else {
		if (json !== undefined) {
			fetchData.body = JSON.stringify(json);
		}
	}

	const res = await fetch(url, fetchData);

	const ret = {
		ok: res.ok,
		status: res.status,
		json: undefined,
	};

	await res
		.clone()
		.json()
		.then((json) => (ret.json = json))
		.catch(() =>
			res.text().then((unexpectedText) => {
				if (200 <= res.status && res.status < 300) {
					ret.ok = false;
					ret.status = 500;
				}

				ret.json = {
					error: "Unexpected response",
					text: unexpectedText,
				};
			}),
		);

	return ret;
}
