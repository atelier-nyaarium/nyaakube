import { removeDiacritics } from "@/assets/common/removeDiacritics";

describe("removeDiacritics", () => {
	it(`should return the same string if it doesn't contain diacritics`, () => {
		const str = "Hello, world!";
		const result = removeDiacritics(str);
		expect(result).toBe(str);
	});

	it(`should return a string without diacritics`, () => {
		const str = "Héllö, F̶͉̃ą̸̃k̷̽́ĕ̶̤b̸̛͝o̵̔̐x!";
		const result = removeDiacritics(str);
		expect(result).toBe("Hello, Fakebox!");
	});

	it(`should throw TypeError if the input is not a string`, () => {
		const notString = 123;
		expect(() => removeDiacritics(notString)).toThrow(TypeError);
		expect(() => removeDiacritics(notString)).toThrow(
			`removeDiacritics(str) : 'str' must be a string.`,
		);
	});
});
