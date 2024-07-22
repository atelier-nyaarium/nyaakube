/**
 * Pause
 *
 * @param time - The time in ms to pause.
 *
 * @returns A Promise that resolves after the specified time.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * await pause(5000);
 */
export function pause(time: number): Promise<void> {
	if (typeof time !== "number" || time < 0) {
		throw new TypeError(`pause(time) : 'time' must be a positive number.`);
	}

	return new Promise((resolve) => {
		setTimeout(resolve, time);
	});
}
