import { benchmark } from "@/assets/common/benchmark";

describe("benchmark function", () => {
	it(`should return a string if third argument is true`, async () => {
		const result = await benchmark(() => {}, 1, true);
		expect(typeof result).toBe("string");
	});

	it(`should return an object if third argument is false or undefined`, async () => {
		let result = await benchmark(() => {}, 1, false);
		expect(typeof result).toBe("object");
		expect(result).toHaveProperty("value");
		expect(result).toHaveProperty("round");
		expect(result).toHaveProperty("unit");

		result = await benchmark(() => {}, 1);
		expect(typeof result).toBe("object");
		expect(result).toHaveProperty("value");
		expect(result).toHaveProperty("round");
		expect(result).toHaveProperty("unit");
	});

	it(`should throw error if first argument is not a function`, async () => {
		await expect(benchmark("not a function", 1)).rejects.toThrow(TypeError);
	});

	it(`should throw error if second argument is not a number`, async () => {
		await expect(benchmark(() => {}, "not a number")).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw error if second argument is less than 1`, async () => {
		await expect(benchmark(() => {}, 0)).rejects.toThrow(TypeError);
	});

	it(`should throw error if third argument is not a boolean`, async () => {
		await expect(benchmark(() => {}, 1, "not a boolean")).rejects.toThrow(
			TypeError,
		);
	});
});
