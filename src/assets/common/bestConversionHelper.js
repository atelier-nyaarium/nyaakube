/**
 * Best Conversion Helper
 *
 * Helper to convert to human readable units
 *
 * @param {number} startingNumber - Value to convert.
 * @param {number} threshold - Multiplier before converting to the next unit (recommended: 1.2).
 * @param {[ { "unit": string, "value": number } ] } conversions - Array of conversions.
 * @param {number} startingConversionsIndex - Which index in `conversions` represents `startingNumber`.
 *
 * @returns {{ unit: string, value: number }} The best conversion in the conversion table.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * See bestByteUnit.js and bestTimeUnitMS.js
 */
export function bestConversionHelper(
	startingNumber,
	threshold,
	conversions,
	startingConversionsIndex,
) {
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

	while (0 < i && startingNumber <= conversions[i - 1]["value"] * threshold) {
		i--;
	}

	while (
		i < conversions.length - 1 &&
		conversions[i + 1]["value"] * threshold <= startingNumber
	) {
		i++;
	}

	return conversions[i];
}
