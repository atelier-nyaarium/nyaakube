import { createPromise } from "@/assets/common";

describe("createPromise", () => {
	it(`should return an object with promise, resolve, and reject`, () => {
		const pr = createPromise();
		expect(pr).toHaveProperty("promise");
		expect(pr).toHaveProperty("resolve");
		expect(pr).toHaveProperty("reject");
		expect(pr.promise).toBeInstanceOf(Promise);
		expect(pr.resolve).toBeInstanceOf(Function);
		expect(pr.reject).toBeInstanceOf(Function);
	});

	it(`should resolve promise when resolve function is called`, async () => {
		const pr = createPromise();
		const testValue = "test";
		pr.resolve(testValue);
		await expect(pr.promise).resolves.toBe(testValue);
	});

	it(`should reject promise when reject function is called`, async () => {
		const pr = createPromise();
		const testError = new Error("test");
		pr.reject(testError);
		await expect(pr.promise).rejects.toThrow(testError);
	});
});
