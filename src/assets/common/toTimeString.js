/**
 * To Time String (human readable. not ISO standard)
 *
 * @param {Date}    date       Value to convert
 *
 * @returns {string}
 */
export default function toTimeString(date) {
	return `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}
