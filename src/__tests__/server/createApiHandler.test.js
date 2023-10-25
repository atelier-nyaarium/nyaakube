import { createApiHandler } from "@/assets/server/createApiHandler";

describe("createApiHandler", () => {
	it(`should return a function`, () => {
		const handler = jest.fn();
		const wrappedHandler = createApiHandler({ handler });
		expect(typeof wrappedHandler).toBe("function");
	});

	it(`should throw error if label is not a string`, () => {
		const handler = jest.fn();
		expect(() => createApiHandler({ label: 123, handler })).toThrow(
			TypeError,
		);
	});

	it(`should throw error if log is not a boolean`, () => {
		const handler = jest.fn();
		expect(() => createApiHandler({ log: "true", handler })).toThrow(
			TypeError,
		);
	});

	it(`should throw error if handler is not a function`, () => {
		expect(() => createApiHandler({ handler: "not a function" })).toThrow(
			TypeError,
		);
	});
});
