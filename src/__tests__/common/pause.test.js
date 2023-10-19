import { pause } from "@/assets/common/pause";

describe("pause", () => {
	it(`should pause execution for the specified time`, async () => {
		let timedValue = await timePause(200);

		if (10 < timedValue) {
			// Try again, just in case the runner is having a performance hiccup
			timedValue = await timePause(200);
		}

		if (10 < timedValue) {
			// 3rd time's the charm...
			timedValue = await timePause(200);
		}

		expect(timedValue).toBeLessThan(10); // Allow 10ms tolerance
	});

	it(`should throw an error if time is not a number`, () => {
		expect(() => pause("5000")).toThrow(TypeError);
	});

	it(`should throw an error if time is negative`, () => {
		expect(() => pause(-5000)).toThrow(TypeError);
	});
});

async function timePause(testTime) {
	const startTime = Date.now();
	await pause(testTime);
	const endTime = Date.now();

	const diffTime = endTime - startTime;
	const abs = Math.abs(diffTime - testTime);

	return abs;
}
