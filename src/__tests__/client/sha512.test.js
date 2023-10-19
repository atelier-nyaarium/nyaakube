import { sha512 } from "@/assets/client/sha512";

describe("sha512", () => {
	it(`returns the correct hash for a string input`, () => {
		const input = "Hello world!";
		const expectedOutput =
			"f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6";

		expect(sha512(input)).toEqual(expectedOutput);
	});

	it(`returns the correct hash for a buffer input`, () => {
		const input = Buffer.from("Hello world!");
		const expectedOutput =
			"f6cde2a0f819314cdde55fc227d8d7dae3d28cc556222a0a8ad66d91ccad4aad6094f517a2182360c9aacf6a3dc323162cb6fd8cdffedb0fe038f55e85ffb5b6";
		expect(sha512(input)).toEqual(expectedOutput);
	});

	it(`throws a TypeError for invalid input`, () => {
		expect(() => sha512(123)).toThrow(TypeError);
	});
});
