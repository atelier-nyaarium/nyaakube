import { useSnackbar } from "@/components/Snackbar";
import { useCallback, useState } from "react";

const DEV = process.env.NODE_ENV !== "production";

/**
 * A wrapper for `useCallback` that provides a loading state and error Snackbars.
 *
 * @param {Function} callback - The callback function.
 * @param {Array} watchList - Watch list like with regular useCallback.
 *
 * @returns {[Function, boolean, Error?]} - A hook containing: wrapped callback, loading state, and Error.
 */
export function useLoadingCallback(callback, watchList) {
	if (DEV) {
		if (typeof callback !== "function") {
			throw new TypeError(
				"useLoadingCallback(callback, watchList) : 'callback' must be a function.",
			);
		}

		if (!Array.isArray(watchList)) {
			throw new TypeError(
				"useLoadingCallback(callback, watchList) : 'watchList' must be an array.",
			);
		}
	}

	const { errorSnack } = useSnackbar();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const wrappedCallback = useCallback(
		async (...args) => {
			let res;

			setLoading(true);
			try {
				res = await callback(...args);
				setError(null);
			} catch (err) {
				if (err instanceof Error) {
					errorSnack(err.message);
				} else if (typeof err === "object") {
					errorSnack(JSON.stringify(err));
				} else {
					errorSnack(err);
				}
				setError(err);
			}
			setLoading(false);

			return res;
		},
		// Do not watch on `call` for the next line. This should behave like useCallback.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[errorSnack, ...watchList],
	);

	return [wrappedCallback, loading, error];
}
