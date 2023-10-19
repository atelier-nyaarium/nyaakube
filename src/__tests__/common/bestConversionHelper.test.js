import { bestConversionHelper } from "@/assets/common/bestConversionHelper";

describe("bestConversionHelper", () => {
	const conversions = [
		{
			unit: "millimeters",
			value: 1,
		},
		{
			unit: "meters",
			value: 1000,
		},
		{
			unit: "kilometers",
			value: 1000000,
		},
	];

	it(`should return the best conversion when index is 0`, () => {
		expect(bestConversionHelper(9, 1.2, conversions, 0)).toEqual({
			unit: "millimeters",
			value: 1,
		});
		expect(bestConversionHelper(5000, 1.2, conversions, 0)).toEqual({
			unit: "meters",
			value: 1000,
		});
		expect(bestConversionHelper(1100000, 1.2, conversions, 0)).toEqual({
			unit: "meters",
			value: 1000,
		});
		expect(bestConversionHelper(1300000, 1.2, conversions, 0)).toEqual({
			unit: "kilometers",
			value: 1000000,
		});
	});

	it(`should return the best conversion when index not 0`, () => {
		expect(bestConversionHelper(0.009, 1.2, conversions, 2)).toEqual({
			unit: "millimeters",
			value: 1,
		});
		expect(bestConversionHelper(40, 1.2, conversions, 2)).toEqual({
			unit: "meters",
			value: 1000,
		});
		expect(bestConversionHelper(2000, 1.2, conversions, 2)).toEqual({
			unit: "kilometers",
			value: 1000000,
		});
	});

	it(`should not exceed the table when the value is very large`, () => {
		expect(bestConversionHelper(100000000000, 1.2, conversions, 0)).toEqual(
			{
				unit: "kilometers",
				value: 1000000,
			},
		);
		expect(bestConversionHelper(100000000000, 1.2, conversions, 2)).toEqual(
			{
				unit: "kilometers",
				value: 1000000,
			},
		);
	});

	it(`should throw TypeError if startingNumber is not a number`, () => {
		expect(() =>
			bestConversionHelper("not a number", 1.2, conversions, 0),
		).toThrow(TypeError);
	});

	it(`should throw TypeError if threshold is not a number`, () => {
		expect(() =>
			bestConversionHelper(1000, "not a number", conversions, 0),
		).toThrow(TypeError);
	});

	it(`should throw TypeError if conversions is not an array`, () => {
		expect(() =>
			bestConversionHelper(1000, 1.2, "not an array", 0),
		).toThrow(TypeError);
	});

	it(`should throw TypeError if startingConversionsIndex is not a number`, () => {
		expect(() =>
			bestConversionHelper(1000, 1.2, conversions, "not a number"),
		).toThrow(TypeError);
	});
});
