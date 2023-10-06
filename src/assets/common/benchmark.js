import bestConversionHelper from "@/assets/common/bestConversionHelper";

/**
 * Runs a benchmark test on a function.
 *
 * @param {Function} f - The function to test.
 * @param {number} count - The number of times to run the function.
 * @param {boolean} [flatten=false] - If true, the result will be a string. If false, the result will be an object.
 *
 * @returns {Promise<(string|{
 * 	  "value": number,
 * 	  "round": number,
 * 	  "unit": string
 * })>} The result of the benchmark test. If 'flatten' is true, the result will be a string instead.
 *
 * @throws {Error} If 'f' is not a function.
 * @throws {Error} If 'count' is not a number. Or less than 1.
 */
export default async function benchmark(f, count, flatten = false) {
	if (typeof f !== "function") {
		throw new Error(
			`benchmark(f, count, flatten?) : 'f' must be a function.`,
		);
	}
	if (typeof count !== "number") {
		throw new Error(
			`benchmark(f, count, flatten?) : 'count' must be a number.`,
		);
	}
	if (count < 1) {
		throw new Error(
			`benchmark(f, count, flatten?) : 'count' must be greater than 0.`,
		);
	}

	const s = new Date();
	if (f.constructor.name === "AsyncFunction") {
		for (let i = 0; i < count; i++) await f();
	} else {
		for (let i = 0; i < count; i++) f();
	}
	const e = new Date();

	const ms = e.getTime() - s.getTime();
	let op_s = count / (ms / 1000);

	op_s = bestConversionHelper(op_s);

	if (flatten) {
		return `${op_s.round} ${op_s.unit}/s`;
	} else {
		return {
			value: op_s.value,
			round: op_s.round,
			unit: `${op_s.unit}/s`,
		};
	}
}
