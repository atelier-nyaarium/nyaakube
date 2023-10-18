import { bestByteUnit } from "@/assets/common/bestByteUnit";

describe("bestByteUnit", () => {
	it(`should be a string if flatten is true`, () => {
		expect(bestByteUnit(100, true)).toEqual("100 B");
	});

	it(`should convert to the best byte possible (1100 B -> no change)`, () => {
		expect(bestByteUnit(1100)).toEqual({
			value: 1100,
			round: 1100,
			unit: "B",
		});
	});

	it(`should convert to the best byte possible (3456 B -> 3.38 KB)`, () => {
		expect(bestByteUnit(3456)).toEqual({
			value: 3.375,
			round: 3.38,
			unit: "KB",
		});
	});

	it(`should convert to the best byte possible (21561344 B -> 20.56 MB)`, () => {
		expect(bestByteUnit(21561344)).toEqual({
			value: 20.5625,
			round: 20.56,
			unit: "MB",
		});
	});

	it(`should convert to the best byte possible (45623184896186 B -> 41.49 TB)`, () => {
		expect(bestByteUnit(45623184896186, true)).toEqual(`41.49 TB`);
	});

	it("should throw TypeError if the parameters are bad", () => {
		expect(() => bestByteUnit("1234")).toThrow(TypeError);
		expect(() => bestByteUnit({})).toThrow(TypeError);
		expect(() => bestByteUnit([])).toThrow(TypeError);
		expect(() => bestByteUnit(null)).toThrow(TypeError);
		expect(() => bestByteUnit(undefined)).toThrow(TypeError);
	});
});
