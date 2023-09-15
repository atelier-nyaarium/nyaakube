/**
 * Promise Helper
 *
 * Returns an unresolved promise with resolve() & reject() exposed to you.
 *
 * @returns {Promise<undefined>}
 *
 * @example await sleep(5000);
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
