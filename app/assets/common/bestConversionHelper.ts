export interface Conversion {
	unit: string;
	value: number;
}

export class ConversionResult {
	value: number;
	round: number;
	unit: string;

	constructor(value: number, round: number, unit: string) {
		this.value = value;
		this.round = round;
		this.unit = unit;

		// Define the toString method as non-enumerable
		Object.defineProperty(this, "toString", {
			value: function () {
				return `${this.round} ${this.unit}`;
			},
			enumerable: false,
		});
	}
}

/**
 * Best Conversion Helper
 *
 * Helper to convert to human readable units
 *
 * @param startingNumber - Value to convert.
 * @param threshold - Multiplier before converting to the next unit (recommended: 1.2).
 * @param conversions - Array of conversions.
 * @param startingConversionsIndex - Which index in `conversions` represents `startingNumber`.
 *
 * @returns The best conversion in the conversion table.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * See bestByteUnit.js and bestTimeUnitMS.js
 */
export function bestConversionHelper(
	startingNumber: number,
	threshold: number,
	conversions: Conversion[],
	startingConversionsIndex: number,
): Conversion {
	if (typeof startingNumber !== "number") {
		throw new TypeError(
			`bestConversionHelper(startingNumber, threshold, conversions, startingConversionsIndex) : 'startingNumber' must be a number.`,
		);
	}

	if (typeof threshold !== "number") {
		throw new TypeError(
			`bestConversionHelper(startingNumber, threshold, conversions, startingConversionsIndex) : 'threshold' must be a number.`,
		);
	}

	if (!Array.isArray(conversions)) {
		throw new TypeError(
			`bestConversionHelper(startingNumber, threshold, conversions, startingConversionsIndex) : 'conversions' must be an array.`,
		);
	}

	if (typeof startingConversionsIndex !== "number") {
		throw new TypeError(
			`bestConversionHelper(startingNumber, threshold, conversions, startingConversionsIndex) : 'startingConversionsIndex' must be a number.`,
		);
	}

	startingNumber = Math.abs(startingNumber);

	let i = startingConversionsIndex;

	while (0 < i && startingNumber <= conversions[i - 1].value * threshold) {
		i--;
	}

	while (
		i < conversions.length - 1 &&
		conversions[i + 1].value * threshold <= startingNumber
	) {
		i++;
	}

	return conversions[i];
}
