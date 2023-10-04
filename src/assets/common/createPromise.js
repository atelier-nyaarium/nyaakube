/**
 * Promise Helper
 *
 * Returns an unresolved promise with resolve() & reject() exposed to you.
 * Suitable for non-promise code, like FileReader.
 *
 * @returns {{
 * 	promise: Promise,
 * 	resolve: Function,
 * 	reject: Function,
 * }} An object containing a promise, resolve(), and reject().
 *
 * @example const pr = createPromise();
 * setTimeout(() => { pr.resolve(); }, 5000);
 * await pr.promise;
 */
export default function createPromise() {
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
