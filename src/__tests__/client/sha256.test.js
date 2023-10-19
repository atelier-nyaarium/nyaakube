import { sha256 } from "@/assets/client/sha256";

describe("sha256", () => {
	it(`returns the correct hash for a string input`, () => {
		const input = "Hello world!";
		const expectedOutput =
			"c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a";

		expect(sha256(input)).toEqual(expectedOutput);
	});

	it(`returns the correct hash for a buffer input`, () => {
		const input = Buffer.from("Hello world!");
		const expectedOutput =
			"c0535e4be2b79ffd93291305436bf889314e4a3faec05ecffcbb7df31ad9e51a";
		expect(sha256(input)).toEqual(expectedOutput);
	});

	it(`throws a TypeError for invalid input`, () => {
		expect(() => sha256(123)).toThrow(TypeError);
	});
});
