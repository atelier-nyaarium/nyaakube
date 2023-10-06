import bestConversionHelper from "@/assets/common/bestConversionHelper";

/**
 * Best Time Unit (ms)
 *
 * Convert a millisecond number to human readable units
 *
 * @param {number}    ms       Value to convert
 * @param {boolean?}  flatten  Return a string instead of object
 *
 * @returns {string | {
 *     "value": number,
 *     "round": number,
 *     "unit": string,
 * }}
 */
export default function bestTimeUnitMS(ms, flatten = false) {
	const conversion = bestConversionHelper(ms, 1.2, conversions, 1);
	const unit = conversion["unit"];
	const value = ms / conversion["value"];
	const round = Math.round(value * 100) / 100;

	if (flatten) {
		if (unit === "ms") return Math.round(round) + " " + unit;
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
		unit: "μs",
		value: 1 / 1000,
	},
	{
		unit: "ms",
		value: 1,
	},
	{
		unit: "s",
		value: 1 * 1000,
	},
	{
		unit: "m",
		value: 1 * 1000 * 60,
	},
	{
		unit: "h",
		value: 1 * 1000 * 60 * 60,
	},
	{
		unit: "d",
		value: 1 * 1000 * 60 * 60 * 24,
	},
];
