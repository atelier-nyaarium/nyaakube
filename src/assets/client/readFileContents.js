import { createPromise } from "@/assets/common/createPromise";

/**
 * Reads the content of a file and returns it as a Uint8Array.
 * Browser only.
 *
 * @param {File} file - The file to read.
 *
 * @returns {Promise<Uint8Array>} A promise that resolves with the file content as a Uint8Array.
 *
 * @throws {TypeError} If the 'file' parameter is not a File object.
 * @throws {Error} If there is an error reading the file.
 *
 * @example
 * const file = files[0];
 * const content = await readFileContent(file);
 * -> Uint8Array(123456) [ 0, 1, 2, 3, 4, 5, ... ]
 */
export async function readFileContent(file) {
	if (!(file instanceof File)) {
		throw new TypeError(
			`readFileContent(file) : 'file' must be a File object.`,
		);
	}

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
