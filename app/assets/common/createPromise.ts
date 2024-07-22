/**
 * Promise Helper
 *
 * Returns an object with an unresolved promise, resolve(), & reject() exposed to you. Suitable for non-promise code, like FileReader.
 *
 * @typedef {PromiseObject<T>}
 * @property {Promise<T>} promise - The newly created promise.
 * @property {function(value: T | PromiseLike<T>): void} resolve - The resolve function for the promise.
 * @property {function(reason?: any): void} reject - The reject function for the promise.
 *
 * @returns {PromiseObject<T>} An object containing the new promise and its resolve and reject functions.
 *
 * @example
 * const pr = createPromise<ArrayBuffer>();
 * const reader = new FileReader();
 * reader.addEventListener("loadend", () => pr.resolve(reader.result));
 * reader.readAsArrayBuffer(file);
 * await pr.promise;
 * return stuff;
 */
export function createPromise<T>() {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (reason?: any) => void;

	const promise = new Promise<T>((rs, rj) => {
		resolve = rs;
		reject = rj;
	});

	return {
		promise,
		resolve: resolve!,
		reject: reject!,
	};
}
