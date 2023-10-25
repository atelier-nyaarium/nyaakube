import { bestConversionHelper } from "@/assets/common/bestConversionHelper";

/**
 * Runs a benchmark test on a function.
 *
 * @param {Function} f - The function to test.
 * @param {number} count - The number of times to run the function.
 * @param {boolean} [flatten=false] - If true, the result will be a string. If false, the result will be an object.
 *
 * @returns {Promise<(string|{
 * 	  value: number,
 * 	  round: number,
 * 	  unit: string
 * })>} The result of the benchmark test. If 'flatten' is true, the result will be a string instead.
 *
 * @throws {TypeError} If 'f' is not a function.
 * @throws {TypeError} If 'count' is not a number. Or less than 1.
 *
 * @example
 * console.log(`Date.now:`, await benchmark(
 *     () => { for (let i = 0; i < 100000; i++) Date.now(); },
 *     1000, true
 * ));
 * console.log(`performance.now:`, await benchmark(
 *     () => { for (let i = 0; i < 100000; i++) performance.now(); },
 *     1000, true
 * ));
 * -> Date.now: "2.53 K/s"
 * -> performance.now: "492.37 /s"
 */
export async function benchmark(f, count, flatten = false) {
	if (typeof f !== "function") {
		throw new TypeError(
			`benchmark(f, count, flatten?) : 'f' must be a function.`,
		);
	}

	if (typeof count !== "number") {
		throw new TypeError(
			`benchmark(f, count, flatten?) : 'count' must be a number.`,
		);
	}

	if (count < 1) {
		throw new TypeError(
			`benchmark(f, count, flatten?) : 'count' must be greater than 0.`,
		);
	}

	if (flatten !== undefined && typeof flatten !== "boolean") {
		throw new TypeError(
			`benchmark(f, count, flatten?) : 'flatten' is optional, but must be a boolean.`,
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
	const opsPerSec = count / (ms / 1000);

	const conversion = bestConversionHelper(opsPerSec, 1.2, conversions, 0);

	const value = opsPerSec / conversion.value;
	const round = Math.round(value * 100) / 100;
	const unit = conversion.unit;

	if (flatten) {
		return `${round} ${unit}`;
	} else {
		return {
			value,
			round,
			unit,
		};
	}
}

const conversions = [
	{
		unit: "/s",
		value: 1,
	},
	{
		unit: "K/s",
		value: 1000,
	},
	{
		unit: "M/s",
		value: 1000 * 1000,
	},
	{
		unit: "B/s",
		value: 1000 * 1000 * 1000,
	},
	{
		unit: "T/s",
		value: 1000 * 1000 * 1000 * 1000,
	},
];
