/**
 * Average
 *
 * Helper to do running averages. Adds a single value to an average.
 *
 * @param {{value: number, weight?: number }}  stats  Stats object containing the current average & weight (aka total count).
 * @param {number}  value      Value to average into the stats.
 * @param {number?}  maxWeight  Max weight that stats is allowed to influence.
 * @returns {{value: number, weight: number }}
 */
export default function average(stats, value, maxWeight = undefined) {
	if (typeof stats !== "object") {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected an object { value, weight } for "stats".`,
		);
	}
	if (typeof stats.value !== "number") {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected a number for "stats.value".`,
		);
	}
	if (
		typeof stats.weight !== "undefined" &&
		typeof stats.weight !== "number"
	) {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected a number for "stats.weight".`,
		);
	}
	if (typeof value !== "number" && typeof value !== "object") {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected a number or object for "value".`,
		);
	}
	if (
		typeof value === "object" &&
		(typeof value.value !== "number" || typeof value.weight !== "number")
	) {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected stats for "value" object.`,
		);
	}
	if (typeof maxWeight !== "undefined" && typeof maxWeight !== "number") {
		throw new Error(
			`average(stats, value, maxWeight) :: Optional "maxWeight" must be a number.`,
		);
	}
	if (typeof maxWeight === "number" && maxWeight < 0) {
		throw new Error(
			`average(stats, value, maxWeight) :: Expected a positive number (or zero) for "maxWeight".`,
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
