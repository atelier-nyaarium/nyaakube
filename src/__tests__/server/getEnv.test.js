import { getEnv } from "@/assets/server/getEnv";

// `structuredClone` is a new feature to ES6, but not supported here yet.
global.structuredClone = (obj) => {
	return JSON.parse(JSON.stringify(obj));
};

describe("getEnv", () => {
	it(`returns the value of the environment variable`, () => {
		process.env.TEST_VAR = "test value";
		expect(getEnv("TEST_VAR")).toEqual("test value");
	});

	it(`parses JSON5 environment variables`, () => {
		process.env["testConfig.json5"] = '{ foo: "test value" }';
		expect(getEnv("testConfig.json5")).toEqual({ foo: "test value" });
	});

	it(`throws a TypeError if the variable name is not a string`, () => {
		expect(() => getEnv(123)).toThrow(TypeError);
	});
});
