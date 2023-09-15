import bestConversion from "@/assets/common/bestConversion";

export default async function benchmark(f, count, flatten) {
	if (typeof f !== "function")
		throw new Error(`benchmark() :: Expected a function.`);

	if (typeof flatten === "undefined") flatten = false;

	const s = new Date();
	if (f.constructor.name === "AsyncFunction") {
		for (let i = 0; i < count; i++) await f();
	} else {
		for (let i = 0; i < count; i++) f();
	}
	const e = new Date();

	const ms = e.getTime() - s.getTime();
	let op_s = count / (ms / 1000);

	op_s = bestConversion(op_s);

	if (flatten) {
		return `${op_s.round} ${op_s.unit}OPS`;
	} else {
		return {
			value: op_s.value,
			round: op_s.round,
			unit: `${op_s.unit}OPS`,
		};
	}
}
