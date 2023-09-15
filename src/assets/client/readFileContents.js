import createPromise from "@/assets/common/createPromise";

export default async function readFileContent(file) {
	const pr = createPromise();

	const views = [];

	const reader = new FileReader();
	reader.addEventListener("load", (event) => {
		const buffer = event.target.result;
		views.push(new Uint8Array(buffer));
	});
	reader.addEventListener("error", (event) => {
		console.warn(`Error reading file`);
		pr.reject(event);
	});
	reader.addEventListener("loadend", (event) => {
		pr.resolve();
	});
	reader.readAsArrayBuffer(file);

	await pr.promise;

	// Concat all buffers

	let newLength = 0;
	for (const v of views) newLength += v.byteLength;

	const newBuffer = new Uint8Array(newLength);
	let offset = 0;
	for (const v of views) {
		const uint8view = new Uint8Array(v.buffer, v.byteOffset, v.byteLength);
		newBuffer.set(uint8view, offset);
		offset += uint8view.byteLength;
	}

	return newBuffer;

	// Convert to string
	// var dec = new TextDecoder();
	// return dec.decode(newBuffer);
}
