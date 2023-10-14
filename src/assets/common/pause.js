/**
 * Pause
 *
 * @param {number} time - The time in ms to pause.
 *
 * @returns {Promise<void>} - Resolves after the specified time.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * await pause(5000);
 */
export function pause(time) {
	if (typeof time !== "number" || time < 0) {
		throw new TypeError(`pause(time) : 'time' must be a positive number.`);
	}

	return new Promise((resolve) => {
		setTimeout(() => resolve(), time);
	});
}
