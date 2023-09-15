/**
 * Sleep Promise Helper
 *
 * @param {number}  time  Time in ms to sleep.
 * @returns {Promise<undefined>}
 *
 * @example await sleep(5000);
 */
export default function sleep(time) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), time);
	});
}
