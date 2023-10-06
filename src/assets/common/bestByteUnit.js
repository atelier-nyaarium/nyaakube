import bestConversionHelper from "@/assets/common/bestConversionHelper";

/**
 * Best Byte Unit (byte)
 *
 * Convert a byte number to human readable units
 *
 * @param {number}    byte     Value to convert
 * @param {boolean?}  flatten  Return a string instead of object
 *
 * @returns {string | {
 *     "value": number,
 *     "round": number,
 *     "unit": string,
 * }}
 */
export default function bestByteUnit(byte, flatten = false) {
	const conversion = bestConversionHelper(byte, 1.2, conversions, 0);
	const unit = conversion["unit"];
	const value = byte / conversion["value"];
	const round = Math.round(value * 100) / 100;

	if (flatten) {
		return round + " " + unit;
	} else {
		return {
			value: value,
			round: round,
			unit: unit,
		};
	}
}

const conversions = [
	{
		unit: "B",
		value: 1,
	},
	{
		unit: "KB",
		value: 1 * 1024,
	},
	{
		unit: "MB",
		value: 1 * 1024 * 1024,
	},
	{
		unit: "GB",
		value: 1 * 1024 * 1024 * 1024,
	},
	{
		unit: "TB",
		value: 1 * 1024 * 1024 * 1024 * 1024,
	},
	{
		unit: "PB",
		value: 1 * 1024 * 1024 * 1024 * 1024 * 1024,
	},
	{
		unit: "EB",
		value: 1 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024,
	},
];
