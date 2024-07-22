import React, { useCallback, useState } from "react";
import { useSnackbar } from "~/components/Snackbar";

const DEV = process.env.NODE_ENV !== "production";

/**
 * A wrapper for `useCallback` that provides a loading state and error Snackbars.
 *
 * @param callback - The callback function.
 * @param watchList - Watch list like with regular useCallback.
 *
 * @returns A hook containing: wrapped callback, loading state, and Error.
 */
export function useLoadingCallback<T extends any[], R>(
	callback: (...args: T) => Promise<R>,
	watchList: any[],
): [(...args: T) => Promise<R | undefined>, boolean, Error | null] {
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

	const snackbar = useSnackbar();

	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const wrappedCallback = useCallback(
		async (...args: T): Promise<R | undefined> => {
			setLoading(true);
			try {
				const result = await callback(...args);
				setError(null);
				return result;
			} catch (err) {
				const errorInstance =
					err instanceof Error ? err : new Error(String(err));
				snackbar({
					type: "error",
					message: errorInstance.message,
				});
				setError(errorInstance);
			} finally {
				setLoading(false);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[snackbar, ...watchList],
	);

	return [wrappedCallback, loading, error];
}
