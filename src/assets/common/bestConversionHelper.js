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
export default function bestConversionHelper(
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
	if (0 < i && startingNumber < conversions[i]["value"]) {
		i--;
		for (; 0 < i; i--) {
			if (startingNumber < conversions[i]["value"]) {
				continue;
			} else {
				break;
			}
		}
	} else if (conversions[i + 1]["value"] * threshold <= startingNumber) {
		i++;
		for (; i < conversions.length - 1; i++) {
			if (conversions[i + 1]["value"] * threshold <= startingNumber) {
				continue;
			} else {
				break;
			}
		}
	}

	return conversions[i];
}
