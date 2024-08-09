import { useMemo, useState } from "react";
import { fetchJson, FetchOptions } from "~/assets/common/fetchJson";
import { useSnackbar } from "~/components/Snackbar";
import { useLoadingCallback } from "~/hooks/useLoadingCallback";

const DEV = process.env.NODE_ENV !== "production";

export interface FetchParams {
	url: string;
	data?: Record<string, any>;
	options?: FetchOptions;
	validate?: () => Promise<boolean>;
	ok?: (data: any) => void;
	error?: (err: Error) => void;
}

export type FetchReturn = [() => Promise<void>, any, boolean, Error | null];

/**
 * A custom React hook that uses `fetchJson` to make API calls and wraps around `useLoadingCallback`.
 *
 * @param paramsCallback - A callback function that returns an object containing the URL, data, and options for the fetch call.
 * @param watchList - Watch list like with regular useCallback.
 *
 * @returns A hook containing: fetch function, loading state, and Error.
 *
 * @throws {TypeError} If the parameter types are bad.
 * @throws {UnauthorizedError} If the response status is 401.
 * @throws {AccessDeniedError} If the response status is 403.
 * @throws {TooManyRequestsError} If the response status is 429.
 * @throws {Error} If the response status is not 200-299.
 * @throws {Error} If the response is not JSON.
 *
 * @example
 * const [fetchData, loading, error] = useFetch(() => ({ url: `/api/session/login`, data: { email, password } }), [email, password]);
 * -> fetchData: Function, loading: boolean, error: Error
 */
export function useFetch(paramsCallback: () => FetchParams, watchList: any[]): FetchReturn {
	const snackbar = useSnackbar();

	const [responseJson, setResponseJson] = useState<any>(null);

	if (DEV) {
		if (typeof paramsCallback !== "function") {
			throw new TypeError(`useFetch(paramsCallback, watchList) : 'paramsCallback' must be a function.`);
		}

		if (paramsCallback.constructor.name === "AsyncFunction") {
			throw new TypeError(`useFetch(paramsCallback, watchList) : 'paramsCallback' cannot be async.`);
		}

		if (!Array.isArray(watchList)) {
			throw new TypeError(`useFetch(paramsCallback, watchList) : 'watchList' must be an array.`);
		}
	}

	// Do not watch on `paramsCallback` for the next line. This should behave like useCallback.
	// DISABLED eslint-disable-next-line react-hooks/exhaustive-deps
	const params = useMemo(() => paramsCallback(), watchList);

	if (DEV) {
		// Params: Expect object
		if (params === null || typeof params !== "object") {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback()' must return an object of parameters for fetch.`,
			);
		}

		// Params: Expect params.url
		if (typeof params.url !== "string") {
			throw new TypeError(`useFetch(paramsCallback, watchList) : 'paramsCallback().url' must be a string.`);
		}

		// Params: Expect optional params.data
		if (params.data !== undefined && (params.data === null || typeof params.data !== "object")) {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback().data' is optional, but must be an object.`,
			);
		}

		// Params: Expect optional params.options
		if (params.options !== undefined && (params.options === null || typeof params.options !== "object")) {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback().options' is optional, but must be an object.`,
			);
		}

		// Params: Expect optional params.validate
		if (params.validate !== undefined && typeof params.validate !== "function") {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback().validate' is optional, but must be a function.`,
			);
		}

		// Params: Expect optional params.ok
		if (params.ok !== undefined && typeof params.ok !== "function") {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback().ok' is optional, but must be a function.`,
			);
		}

		// Params: Expect optional params.error
		if (params.error !== undefined && typeof params.error !== "function") {
			throw new TypeError(
				`useFetch(paramsCallback, watchList) : 'paramsCallback().error' is optional, but must be a function.`,
			);
		}
	}

	const [fetchCallback, loading, error] = useLoadingCallback(
		async () => {
			if (params.validate && !(await params.validate())) {
				// Validation check failed
				return;
			}

			try {
				const data = await fetchJson(params.url, params.data, params.options);
				if (params.ok) {
					await params.ok(data);
				}
				setResponseJson(data);
				return data;
			} catch (error: any) {
				if (params.error) {
					await params.error(error);
				} else {
					snackbar({
						type: "error",
						message: error instanceof Error ? error.message : String(error),
					});
				}
			}
		},
		// Do not watch on `params` for the next line. This should behave like useCallback.
		// DISABLED eslint-disable-next-line react-hooks/exhaustive-deps
		[snackbar, ...watchList],
	);

	return [fetchCallback, responseJson, loading, error];
}
