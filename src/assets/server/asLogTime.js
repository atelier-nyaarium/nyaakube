import moment from "moment-timezone";

/**
 * Converts a date to Unix syslog date format.
 *
 * @param {Date} [date] - The date to be converted to Unix syslog date format.
 *
 * @returns {string} The date in Unix syslog date format.
 */
export default function asLogTime(date = undefined) {
	return moment(date).toISOString().replace(/T/, " ").replace(/\..*/, "");
}
