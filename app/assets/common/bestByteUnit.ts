import {
	bestConversionHelper,
	Conversion,
	ConversionResult,
} from "~/assets/common/bestConversionHelper";

/**
 * Convert a byte number to human readable units.
 *
 * @param byte - Value to convert.
 *
 * @returns An instance of ConversionResult with value, round, unit, and a toString method that flattens the output.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const result = bestByteUnit(2000000);
 * console.log(result.toString());
 * -> "1.91 MB"
 */
export function bestByteUnit(byte: number): ConversionResult {
	if (typeof byte !== "number") {
		throw new TypeError(`bestByteUnit(byte) : 'byte' must be a number.`);
	}

	const conversions: Conversion[] = [
		{ unit: "B", value: 1 },
		{ unit: "KB", value: 1 * 1024 },
		{ unit: "MB", value: 1 * 1024 * 1024 },
		{ unit: "GB", value: 1 * 1024 * 1024 * 1024 },
		{ unit: "TB", value: 1 * 1024 * 1024 * 1024 * 1024 },
		{ unit: "PB", value: 1 * 1024 * 1024 * 1024 * 1024 * 1024 },
		{ unit: "EB", value: 1 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
	];

	const conversion = bestConversionHelper(byte, 1.2, conversions, 0);
	const value = byte / conversion.value;
	const round = Math.round(value * 100) / 100;

	return new ConversionResult(value, round, conversion.unit);
}
