/**
 * To Date String (human readable. not ISO standard)
 *
 * @param {Date}    date       Value to convert
 * @returns {string}
 */
export default function toDateString(date) {
	return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" : ""}${
		date.getMonth() + 1
	}-${date.getDate() < 10 ? "0" : ""}${date.getDate()}`;
}
