import {
	bestConversionHelper,
	Conversion,
	ConversionResult,
} from "~/assets/common/bestConversionHelper";

/**
 * Convert a millisecond number to human readable units.
 *
 * @param ms - Value to convert.
 *
 * @returns An instance of ConversionResult with value, round, unit, and a toString method that flattens the output.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const result = bestTimeUnitMS(4500000);
 * console.log(result.toString());
 * -> "1.25 h"
 */
export function bestTimeUnitMS(ms: number): ConversionResult {
	if (typeof ms !== "number") {
		throw new TypeError(`bestTimeUnitMS(ms) : 'ms' must be a number.`);
	}

	const conversions: Conversion[] = [
		{ unit: "μs", value: 1 / 1000 },
		{ unit: "ms", value: 1 },
		{ unit: "s", value: 1000 },
		{ unit: "m", value: 1000 * 60 },
		{ unit: "h", value: 1000 * 60 * 60 },
		{ unit: "d", value: 1000 * 60 * 60 * 24 },
	];

	const conversion = bestConversionHelper(ms, 1.2, conversions, 1);
	const value = ms / conversion.value;
	const round = Math.round(value * 100) / 100;

	return new ConversionResult(value, round, conversion.unit);
}
