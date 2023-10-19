import { asLogTime } from "@/assets/server/asLogTime";

describe("asLogTime", () => {
	it(`returns a string in the correct format`, () => {
		const date = new Date("2022-01-01T01:23:45.678Z");
		const expected = "2022-01-01 01-23-45";
		const result = asLogTime(date);
		expect(result).toEqual(expected);
	});

	it(`returns the current time if no date is provided`, () => {
		const now = new Date();
		const expected = asLogTime(now);
		const result = asLogTime();
		expect(result).toEqual(expected);
	});

	it(`throws a TypeError if the argument is not a Date object`, () => {
		expect(() => asLogTime("not a date")).toThrow(TypeError);
	});
});
