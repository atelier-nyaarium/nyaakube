/**
 * Best Conversion
 *
 * Helper to convert to human readable units
 *
 * See examples in the functions below for example usage
 *
 * @param {number}  startingNumber            Value to convert.
 * @param {number}  threshold                 Multiplier before converting to the next unit (recommended: 1.2).
 * @param {[ { "unit": string, "value": number } ] }  conversions  Array of conversions.
 * @param {number}  startingConversionsIndex  Which index in `conversions` represents `startingNumber`.
 * @returns {{
 *     "unit": string,
 *     "value": number,
 * }}
 */
export default function bestConversion(
	startingNumber,
	threshold,
	conversions,
	startingConversionsIndex,
) {
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
