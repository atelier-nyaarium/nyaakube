/**
 * Pauses the execution for a given number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to pause for.
 *
 * @returns {Promise<void>} A promise that resolves when the pause is over.
 *
 * @throws {Error} - If the argument is not a number.
 */
export default function pause(ms) {
	if (typeof ms !== "number") throw new Error(`Expected a number`);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}
