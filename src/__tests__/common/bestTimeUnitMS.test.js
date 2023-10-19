import { bestTimeUnitMS } from "@/assets/common/bestTimeUnitMS";

describe("bestTimeUnitMS", () => {
	it(`should convert to the best time possible (1100 ms -> no change)`, () => {
		expect(bestTimeUnitMS(1100)).toEqual({
			value: 1100,
			round: 1100,
			unit: "ms",
		});
	});

	it(`should convert to the best time possible (3456 ms -> 3.46 s)`, () => {
		expect(bestTimeUnitMS(3456)).toEqual({
			value: 3.456,
			round: 3.46,
			unit: "s",
		});
	});

	it(`should convert to the best time possible (23184896186 ms -> 6.93 h)`, () => {
		expect(bestTimeUnitMS(23184896186, true)).toEqual(`268.34 d`);
	});

	it(`should throw error if ms is not a number`, () => {
		expect(() => bestTimeUnitMS("test")).toThrow(TypeError);
	});

	it(`should throw error if flatten is not a boolean`, () => {
		expect(() => bestTimeUnitMS(1024, "test")).toThrow(TypeError);
	});
});
