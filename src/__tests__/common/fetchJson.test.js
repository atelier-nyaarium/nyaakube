import {
	AccessDeniedError,
	TooManyRequestsError,
	UnauthorizedError,
} from "@/assets/ErrorTypes";
import { fetchJson } from "@/assets/common/fetchJson";

describe("fetchJson", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it(`should return a JSON object`, async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				status: 200,
				clone: function () {
					return this;
				},
				json: () => Promise.resolve({ foobar: 42 }),
				text: () => Promise.resolve("success"),
			}),
		);

		const data = await fetchJson("/test/url");
		expect(data).toEqual({ foobar: 42 });
	});

	it(`should throw an error if url is not a string`, async () => {
		await expect(fetchJson(123)).rejects.toThrow(TypeError);
	});

	it(`should throw an error if data is not an object`, async () => {
		await expect(fetchJson("/test/url", "string")).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw an error if options is not an object`, async () => {
		await expect(fetchJson("/test/url", {}, "string")).rejects.toThrow(
			TypeError,
		);
	});

	it(`should throw UnauthorizedError if status is 401`, async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				status: 401,
				clone: function () {
					return this;
				},
				json: () => Promise.resolve({ message: "Unauthorized" }),
				text: () => Promise.resolve("Unauthorized"),
			}),
		);

		await expect(fetchJson("/test/url")).rejects.toThrow(UnauthorizedError);
	});

	it(`should throw AccessDeniedError if status is 403`, async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				status: 403,
				clone: function () {
					return this;
				},
				json: () => Promise.resolve({ message: "Access Denied" }),
				text: () => Promise.resolve("Access Denied"),
			}),
		);

		await expect(fetchJson("/test/url")).rejects.toThrow(AccessDeniedError);
	});

	it(`should throw TooManyRequestsError if status is 429`, async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				status: 429,
				clone: function () {
					return this;
				},
				json: () => Promise.resolve({ message: "Too Many Requests" }),
				text: () => Promise.resolve("Too Many Requests"),
			}),
		);

		await expect(fetchJson("/test/url")).rejects.toThrow(
			TooManyRequestsError,
		);
	});
});
