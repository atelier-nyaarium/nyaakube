/**
 * Promise Helper
 *
 * Returns an object with an unresolved promise, resolve(), & reject() exposed to you. Suitable for non-promise code, like FileReader.
 *
 * @typedef {Object} PromiseObject
 * @property {Promise<any>} promise - The newly created promise.
 * @property {function(any): void} resolve - The resolve function for the promise.
 * @property {function(any): void} reject - The reject function for the promise.
 *
 * @returns {PromiseObject} An object containing the new promise and its resolve and reject functions.
 *
 * @example
 * const pr = createPromise();
 * const reader = new FileReader();
 * reader.addEventListener("loadend", pr.resolve);
 * reader.readAsArrayBuffer(file);
 * await pr.promise;
 * return stuff;
 */
export function createPromise() {
	let resolve, reject;
	const promise = new Promise((rs, rj) => {
		resolve = rs;
		reject = rj;
	});
	return {
		promise,
		resolve,
		reject,
	};
}
