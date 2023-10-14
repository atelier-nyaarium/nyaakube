import moment from "moment-timezone";

/**
 * Converts a date to Unix log date format.
 *
 * @param {Date} [date] - The date to convert. Defaults to now.
 *
 * @returns {string} The date in Unix log date format.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const timestamp = asLogTime(new Date());
 * -> "2020-01-01 01-23-45"
 */
export function asLogTime(date = undefined) {
	if (date !== undefined && !(date instanceof Date)) {
		throw new TypeError(
			`asLogTime(date?) : 'date' is optional, but must be a Date.`,
		);
	}

	if (date === undefined) date = new Date();

	return moment(date)
		.toISOString()
		.replace(/T/, " ")
		.replace(/\..*/, "")
		.replace(/:/g, "-");
}
