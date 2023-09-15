export default function pause(ms) {
	if (typeof ms !== "number") throw new Error(`Expected a number`);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(undefined);
		}, ms);
	});
}
