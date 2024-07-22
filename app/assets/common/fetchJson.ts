import json5 from "json5";
import _ from "lodash";
import { encodeQueryString } from "~/assets/common/encodeQueryString";
import { pause } from "~/assets/common/pause";
import {
	AccessDeniedError,
	TooManyRequestsError,
	UnauthorizedError,
} from "~/assets/ErrorTypes";

const FETCH_BACKOFF_DELAY = 30000;

export interface FetchOptions extends RequestInit {
	form?: boolean;
	accessToken?: string;
	clientId?: string;
	retry?: number;
}

/**
 * Fetch [GET|POST] JSON
 *
 * Formats a fetch call to send & accept JSON.
 * Sets the method to POST if a JSON is provided.
 *
 * If the server fails to return a JSON (typically fatal errors), this will error with the whole HTML response.
 *
 * @param url - The URL to fetch.
 * @param data - Optional JSON data to send.
 * @param otherOptions - Optional fetch options.
 *
 * @returns The JSON response.
 *
 * @throws TypeError If the parameter types are bad.
 * @throws UnauthorizedError If the response status is 401.
 * @throws AccessDeniedError If the response status is 403.
 * @throws TooManyRequestsError If the response status is 429.
 * @throws Error If the response status is not 200-299.
 * @throws Error If the response is not JSON.
 *
 * @example
 * const data = await fetchJson(`/api/session/login`, { email, password });
 * -> { success: true, message: "Login successful." }
 */
export async function fetchJson(
	url: string,
	data?: Record<string, any>,
	options: FetchOptions = {},
): Promise<any> {
	if (typeof url !== "string") {
		throw new TypeError(
			`fetchJson(url, data?, options?) : 'url' must be a string.`,
		);
	}
	if (data !== undefined && (typeof data !== "object" || data === null)) {
		throw new TypeError(
			`fetchJson(url, data?, options?) : 'data' is optional, but must be an object.`,
		);
	}
	if (
		options !== undefined &&
		(typeof options !== "object" || options === null)
	) {
		throw new TypeError(
			`fetchJson(url, data?, options?) : 'options' is optional, but must be an object.`,
		);
	}

	const { accessToken, clientId, retry, ...otherOptions } = options;

	if (retry !== undefined) {
		if (!Number.isInteger(retry)) {
			throw new TypeError(
				`fetchJson(url, data?, options?) : Optional 'retry' must be an integer.`,
			);
		}
		if (retry < 0) {
			throw new TypeError(
				`fetchJson(url, data?, options?) : Optional 'retry' must be 0 or greater.`,
			);
		}
	}

	const asForm = !!otherOptions.form;

	let fetchData: RequestInit;

	if (asForm) {
		fetchData = _.merge(
			{
				method: "post",
			},
			otherOptions,
		);
	} else {
		const defaultMethod = data !== undefined ? "post" : "get";
		fetchData = _.merge(
			{
				method: otherOptions.method
					? otherOptions.method
					: defaultMethod,
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
			},
			otherOptions,
		);
	}

	if (asForm) {
		const formData = new FormData();
		if (data) {
			Object.entries(data).forEach(([key, value]) => {
				if (value instanceof FileList || Array.isArray(value)) {
					for (const v of value) formData.append(key, v);
				} else {
					formData.append(key, value);
				}
			});
		}
		fetchData.body = formData;
	} else {
		if (data !== undefined) {
			if (fetchData.method?.toLowerCase() === "get") {
				url = encodeQueryString(data, url);
			} else {
				fetchData.body = JSON.stringify(data);
			}
		}
	}

	// If data is being sent by headers, stringify it.
	if (
		fetchData.headers &&
		(fetchData.headers as Record<string, string>).data
	) {
		(fetchData.headers as Record<string, string>).data = json5.stringify(
			(fetchData.headers as Record<string, string>).data,
		);
	}

	if (accessToken) {
		if (!fetchData.headers) fetchData.headers = {};
		(fetchData.headers as Record<string, string>)[
			"Authorization"
		] = `Bearer ${accessToken}`;
	}

	if (clientId) {
		if (!fetchData.headers) fetchData.headers = {};
		(fetchData.headers as Record<string, string>)["Client-ID"] = clientId;
	}

	let res: Response = new Response();
	if (retry) {
		for (let i = 0; i < retry; i++) {
			const delay = 10000 + i * FETCH_BACKOFF_DELAY;
			try {
				res = await fetch(url, fetchData);
				break;
			} catch (error: any) {
				if (
					error.name === "AbortError" ||
					error.name === "ConnectTimeoutError" ||
					error.name === "SocketError"
				) {
					if (i === retry - 1) throw error;

					if (error.cause) {
						console.log(
							`fetchJson:  ${error.name}  maps to  ${error.cause.code}`,
						);
					} else {
						console.log(`fetchJson:  error.cause doesnt exist`);
					}

					// Pause and loop again
					await pause(delay);
				} else {
					throw error;
				}
			}
		}
	} else {
		res = await fetch(url, fetchData);
	}

	let json;
	try {
		json = await res.clone().json();
	} catch (err) {
		const unexpectedText = await res.text();
		if (res.status === 401) {
			throw new UnauthorizedError(unexpectedText);
		}
		if (res.status === 403) {
			throw new AccessDeniedError(unexpectedText);
		}
		if (res.status === 429) {
			throw new TooManyRequestsError(unexpectedText);
		}
		throw new Error(
			`[${res.status}] Unexpected non-json response: ` + unexpectedText,
		);
	}

	if (200 <= res.status && res.status < 300) {
		return json;
	} else {
		if (res.status === 401) {
			throw new UnauthorizedError(json.message);
		}
		if (res.status === 403) {
			throw new AccessDeniedError(json.message);
		}
		if (res.status === 429) {
			throw new TooManyRequestsError(json.message);
		}

		const errorRet = new Error(json.message ?? JSON.stringify(json));
		(errorRet as any).status = res.status;
		(errorRet as any).json = json;
		throw errorRet;
	}
}
