/**
 * Calculates the rolling average of a new value with an existing average.
 *
 * @param {Object} stats - The existing stats object. Must have 'value' and 'weight' properties.
 * @param {(number|Object)} value - The new value to be averaged. If it's an object, it must have 'value' and 'weight' properties.
 * @param {number} [maxWeight] - The maximum weight that can be considered for the existing average.
 *
 * @throws {Error} If 'stats' is not an object, or if 'stats.value' is not a number, or if 'stats.weight' is not a number.
 * @throws {Error} If 'value' is not a number or an object, or if it's an object and doesn't have 'value' and 'weight' properties.
 * @throws {Error} If 'maxWeight' is defined but is not a number, or if it's a negative number.
 *
 * @returns {{
 * 	   value: number,
 * 	   weight: number
 * }} An object with the new average 'value' and 'weight'.
 *
 * @example
 * let stats = { value: 0 };
 * stats = average(stats, 42);
 * -> { value: 42, weight: 1 }
 * stats = average(stats, 50);
 * -> { value: 46, weight: 2 }
 */
export function average(stats, value, maxWeight = undefined) {
	if (typeof stats !== "object") {
		throw new Error(
			`average(stats, value, maxWeight?) : 'stats' must be an object.`,
		);
	}
	if (typeof stats.value !== "number") {
		throw new Error(
			`average(stats, value, maxWeight?) : 'stats.value' must be a number.`,
		);
	}
	if (stats.weight !== undefined && typeof stats.weight !== "number") {
		throw new Error(
			`average(stats, value, maxWeight?) : 'stats.weight' must be a number.`,
		);
	}
	if (typeof value !== "number" && typeof value !== "object") {
		throw new Error(
			`average(stats, value, maxWeight?) : 'value' must be a number or an object.`,
		);
	}
	if (
		typeof value === "object" &&
		(typeof value.value !== "number" || typeof value.weight !== "number")
	) {
		throw new Error(
			`average(stats, value, maxWeight?) : 'value' must be a number or an object with 'value' and 'weight' properties.`,
		);
	}
	if (typeof maxWeight !== "undefined" && typeof maxWeight !== "number") {
		throw new Error(
			`average(stats, value, maxWeight?) : 'maxWeight' is optional, but must be a number.`,
		);
	}
	if (typeof maxWeight === "number" && maxWeight < 0) {
		throw new Error(
			`average(stats, value, maxWeight?) : 'maxWeight' is optional, but must be a positive number.`,
		);
	}

	if (!stats.weight) {
		if (typeof value === "number") {
			return { value, weight: 1 };
		} else {
			return { value: value.value, weight: value.weight };
		}
	}

	if (typeof maxWeight === "number") {
		const croppedWeight = Math.min(maxWeight, stats.weight);
		let sum, newWeight;
		if (typeof value === "number") {
			sum = value + stats.value * croppedWeight;
			newWeight = Math.min(maxWeight, croppedWeight + 1);
			return {
				value: sum / (1 + croppedWeight),
				weight: newWeight,
			};
		} else {
			sum = value.value * value.weight + stats.value * croppedWeight;
			newWeight = Math.min(maxWeight, value.weight + croppedWeight);
			return {
				value: sum / (value.weight + croppedWeight),
				weight: newWeight,
			};
		}
	} else {
		let sum, newWeight;
		if (typeof value === "number") {
			sum = value + stats.value * stats.weight;
			newWeight = stats.weight + 1;
		} else {
			sum = value.value * value.weight + stats.value * stats.weight;
			newWeight = value.weight + stats.weight;
		}

		return {
			value: sum / newWeight,
			weight: newWeight,
		};
	}
}
