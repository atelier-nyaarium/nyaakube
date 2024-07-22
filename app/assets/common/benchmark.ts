import {
	Conversion,
	bestConversionHelper,
} from "~/assets/common/bestConversionHelper";

/**
 * Runs a benchmark test on a function.
 *
 * @param f - The function to test.
 * @param count - The number of times to run the function.
 *
 * @returns The result of the benchmark test.
 *
 * @throws TypeError If 'f' is not a function.
 * @throws TypeError If 'count' is not a number or is less than 1.
 *
 * @example
 * console.log(`Date.now:`, await benchmark(
 *     () => { for (let i = 0; i < 100000; i++) Date.now(); },
 *     1000
 * ));
 * console.log(`performance.now:`, await benchmark(
 *     () => { for (let i = 0; i < 100000; i++) performance.now(); },
 *     1000
 * ));
 * -> Date.now: "2.53 K/s"
 * -> performance.now: "492.37 /s"
 */
export async function benchmark(f: Function, count: number): Promise<string> {
	if (typeof f !== "function") {
		throw new TypeError(`benchmark(f, count) : 'f' must be a function.`);
	}

	if (typeof count !== "number") {
		throw new TypeError(`benchmark(f, count) : 'count' must be a number.`);
	}

	if (count < 1) {
		throw new TypeError(
			`benchmark(f, count) : 'count' must be greater than 0.`,
		);
	}

	const conversions: Conversion[] = [
		{ unit: "/s", value: 1 },
		{ unit: "K/s", value: 1000 },
		{ unit: "M/s", value: 1000 * 1000 },
		{ unit: "B/s", value: 1000 * 1000 * 1000 },
		{ unit: "T/s", value: 1000 * 1000 * 1000 * 1000 },
	];

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

	return `${round} ${unit}`;
}
