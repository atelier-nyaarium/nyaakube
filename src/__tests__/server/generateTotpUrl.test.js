import { generateTotpUrl } from "@/assets/server/generateTotpUrl";

describe("generateTotpUrl", () => {
	it(`should generate a TOTP URL`, () => {
		expect(
			generateTotpUrl("Atelier Nyaarium", "user@email", 6, 30, "ABC"),
		).toEqual(
			"otpauth://totp/Atelier%20Nyaarium:user%40email?secret=ABC&issuer=Atelier%2520Nyaarium&algorithm=SHA1&digits=6&period=30",
		);
	});

	it(`should throw error if label is not a string`, () => {
		expect(() => generateTotpUrl(123, 6, 30, "ABC")).toThrow(TypeError);
	});

	it(`should throw error if digits is not a number`, () => {
		expect(() =>
			generateTotpUrl("Foo Bar:user@email", "6", 30, "ABC"),
		).toThrow(TypeError);
	});

	it(`should throw error if period is not a number`, () => {
		expect(() =>
			generateTotpUrl("Foo Bar:user@email", 6, "30", "ABC"),
		).toThrow(TypeError);
	});

	it(`should throw error if secret is not a string`, () => {
		expect(() => generateTotpUrl("Foo Bar:user@email", 6, 30, 123)).toThrow(
			TypeError,
		);
	});
});
