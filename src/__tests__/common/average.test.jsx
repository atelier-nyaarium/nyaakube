import { average } from "@/assets/common/average";

describe("average", () => {
	it(`should work when value is a number`, () => {
		const stats = { value: 42, weight: 1 };
		const value = 50;
		const result = average(stats, value);
		expect(result).toEqual({ value: 46, weight: 2 });
	});

	it(`should return the value when weight is undefined`, () => {
		const stats = { value: 0 };
		const value = 42;
		const result = average(stats, value);
		expect(result).toEqual({ value: 42, weight: 1 });
	});

	it(`should return the value when weight is 0`, () => {
		const stats = { value: 0, weight: 0 };
		const value = { value: 42, weight: 1 };
		const result = average(stats, value);
		expect(result).toEqual({ value: 42, weight: 1 });
	});

	it(`should return the correct average for higher stats.value`, () => {
		const stats = { value: 360, weight: 4 };
		const value = { value: 90, weight: 1 };
		const result = average(stats, value);
		expect(result).toEqual({ value: 306, weight: 5 });
	});

	it(`should return the correct average for higher value.value`, () => {
		const stats = { value: 360, weight: 7 };
		const value = { value: 90, weight: 3 };
		const result = average(stats, value);
		expect(result).toEqual({ value: 279, weight: 10 });
	});

	it(`should return cap the weight to maxWeight when defined`, () => {
		const stats = { value: 40, weight: 1 };
		const value = { value: 50, weight: 1 };
		const maxWeight = 1;
		const result = average(stats, value, maxWeight);
		expect(result).toEqual({ value: 45, weight: 1 });
	});

	it(`should throw an error when stats is not an object`, () => {
		const stats = "not an object";
		const value = 42;
		expect(() => average(stats, value)).toThrow(TypeError);
	});

	it(`should throw an error when stats.value is not a number`, () => {
		const stats = { value: "not a number", weight: 1 };
		const value = 42;
		expect(() => average(stats, value)).toThrow(TypeError);
	});

	it(`should throw an error when stats.weight is not a number`, () => {
		const stats = { value: 42, weight: "not a number" };
		const value = 42;
		expect(() => average(stats, value)).toThrow(TypeError);
	});

	it(`should throw an error when value is not a number or an object`, () => {
		const stats = { value: 42, weight: 1 };
		const value = "not a number or an object";
		expect(() => average(stats, value)).toThrow(TypeError);
	});

	it(`should throw an error when value is an object but does not have value and weight properties`, () => {
		const stats = { value: 42, weight: 1 };
		const value = { notValue: 50, notWeight: 2 };
		expect(() => average(stats, value)).toThrow(TypeError);
	});

	it(`should throw an error when maxWeight is defined but is not a number`, () => {
		const stats = { value: 42, weight: 1 };
		const value = 50;
		const maxWeight = "not a number";
		expect(() => average(stats, value, maxWeight)).toThrow(TypeError);
	});

	it(`should throw an error when maxWeight is a negative number`, () => {
		const stats = { value: 42, weight: 1 };
		const value = 50;
		const maxWeight = -1;
		expect(() => average(stats, value, maxWeight)).toThrow(TypeError);
	});
});
