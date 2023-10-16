import { useSnackbar } from "@/components/Snackbar";
import { useCallback, useState } from "react";

/**
 * A wrapper for `useCallback` that provides a loading state and error Snackbars.
 *
 * @param {Function} options.call - The function to call.
 * @param {Function} [options.error] - Error handler function.
 * @param {Array} watchList - Watch list like with regular useCallback.
 *
 * @returns {[Function, boolean]} - A pair containing the wrapped callback and a loading state.
 */
export function useLoadingCallback({ call, error = undefined }, watchList) {
	const { infoSnack, errorSnack } = useSnackbar();

	const [loading, setLoading] = useState(false);

	const wrappedCallback = useCallback(
		async (...args) => {
			let res;

			setLoading(true);
			try {
				res = await call(...args);
			} catch (err) {
				if (err instanceof Error) {
					errorSnack(err.message);
				} else if (typeof err === "object") {
					errorSnack(JSON.stringify(err));
				} else {
					errorSnack(err);
				}
				res = await error(err);
			}
			setLoading(false);

			return res;
		},
		// Do not watch on `call` or `error` for the next line.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[errorSnack, infoSnack, ...watchList],
	);

	return [wrappedCallback, loading];
}
