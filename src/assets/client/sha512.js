import { createHash } from "crypto";

/**
 * Generates a SHA-512 hash of the provided data.
 *
 * @param {Buffer|string} data - The data to hash.
 *
 * @returns {string} The generated SHA-512 hash.
 *
 * @throws {TypeError} If the 'data' parameter is not a Buffer or a string.
 *
 * @example
 * const checksum = sha512("Hello world!");
 * -> "f6cde2a0f819314cdde55fc2 . . . "
 */
export function sha512(data) {
	if (!Buffer.isBuffer(data) && typeof data !== "string") {
		throw new TypeError(
			"sha512(data) : 'data' must be a Buffer or a string.",
		);
	}

	const hash = createHash("sha512");
	hash.update(data);
	return hash.digest("hex");
}
