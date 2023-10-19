import { decodeQueryString } from "@/assets/client/decodeQueryString";

describe("decodeQueryString", () => {
	it(`should decode a query string into an object`, () => {
		const queryString = "?foo=bar&baz=qux";
		const expected = { foo: "bar", baz: "qux" };
		expect(decodeQueryString(queryString)).toEqual(expected);
	});

	it(`should omit empty pair values`, () => {
		const queryString = "?foo=bar&baz=";
		const expected = { foo: "bar" };
		expect(decodeQueryString(queryString)).toEqual(expected);
	});

	it(`should throw a TypeError if the parameter types are bad`, () => {
		expect(() => decodeQueryString(123)).toThrow(TypeError);
	});

	it(`should throw an error if the query string is not well-formed`, () => {
		const queryString = "?foo=bar=baz";
		expect(() => decodeQueryString(queryString)).toThrow(Error);
	});
});
