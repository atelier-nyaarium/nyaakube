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
 * @param {string}   url      URL
 * @param {object?}  data     JSON'able object to send (will set the method to POST)
 * @param {object?}  options  Options object
 *
 * @returns {Promise<{ ok: boolean, status: number, json: JSON, text: string }>}  Promises a response object.
 *
 * @example await fetchJSON(`/api/session/login`, { username, password })
 * .then(async res => {
 *     console.log(res.ok)
 *     console.log(res.status)
 *     console.log(res.json)
 *     console.log(res.text)
 * })
 */
export default async function fetchJSON(url, data, optionsOverride = {}) {
	if (typeof url !== "string") {
		throw new Error(`fetchJSON(url, data) :: Call Error. Expected a url.`);
	}

	const asForm = !!optionsOverride?.form;

	let options;

	if (asForm) {
		options = _.merge(
			{
				method: "post",
			},
			optionsOverride,
		);
	} else {
		options = _.merge(
			{
				method: typeof data === "undefined" ? "get" : "post",
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			},
			optionsOverride,
		);
	}

	if (asForm) {
		const formData = new FormData();

		Object.entries(data).forEach(([key, value]) => {
			if (value instanceof FileList || Array.isArray(value)) {
				for (const v of value) formData.append(key, v);
			} else {
				formData.append(key, value);
			}
		});

		options.body = formData;
	} else {
		if (typeof data !== "undefined") {
			options.body = JSON.stringify(data);
		}
	}

	const res = await fetch(url, options);

	const ret = {
		ok: res.ok,
		status: res.status,
		json: undefined,
		text: undefined,
	};

	await res
		.clone()
		.json()
		.then((json) => (ret.json = json))
		.catch(() => res.text().then((text) => (ret.text = text)));

	if (ret.text) {
		console.error(`${url}\nExpected a JSON response.`);
		console.log(ret);
	}

	return ret;
}
