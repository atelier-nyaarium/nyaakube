import { encodeQueryString } from "@/assets/client/encodeQueryString";

describe("encodeQueryString", () => {
	it(`encodes an object into a query string`, () => {
		const data = { foo: "bar", baz: 42 };
		const expected = "foo=bar&baz=42";
		expect(encodeQueryString(data)).toEqual(expected);
	});

	it(`appends query string to URL if provided`, () => {
		const data = { foo: "bar", baz: 42 };
		const url = "https://example.com";
		const expected = "https://example.com?foo=bar&baz=42";
		expect(encodeQueryString(data, url)).toEqual(expected);
	});

	it(`throws a TypeError if 'data' is not an object`, () => {
		const data = "not an object";
		expect(() => encodeQueryString(data)).toThrow(TypeError);
	});

	it(`throws a TypeError if 'url' is provided but not a string`, () => {
		const data = { foo: "bar" };
		const url = 42;
		expect(() => encodeQueryString(data, url)).toThrow(TypeError);
	});
});
