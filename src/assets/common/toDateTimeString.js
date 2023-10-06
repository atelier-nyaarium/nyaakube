import toDateString from "@/assets/common/toDateString";
import toTimeString from "@/assets/common/toTimeString";

/**
 * To Date + Time String (human readable. not ISO standard)
 *
 * @param {Date}    date       Value to convert
 *
 * @returns {string}
 */
export default function toDateTimeString(date) {
	return toDateString(date) + " " + toTimeString(date);
}
