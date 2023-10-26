import { createHash } from "crypto";

/**
 * Generates a SHA-256 hash of the provided data.
 *
 * @param {Buffer|string} data - The data to hash.
 *
 * @returns {string} The generated SHA-256 hash.
 *
 * @throws {TypeError} If the 'data' parameter is not a Buffer or a string.
 *
 * @example
 * const checksum = sha256("Hello world!");
 * -> "c0535e4be2b79ffd93291305 . . . "
 */
export function sha256(data) {
	if (!Buffer.isBuffer(data) && typeof data !== "string") {
		throw new TypeError(
			"sha256(data) : 'data' must be a Buffer or a string.",
		);
	}

	const hash = createHash("sha256");
	hash.update(data);
	return hash.digest("hex");
}
