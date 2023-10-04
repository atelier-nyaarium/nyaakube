import { createHash } from "crypto";

/**
 * Generates a SHA-512 hash of the provided data.
 *
 * @param {string} data - The data to be hashed.
 *
 * @returns {string} The generated SHA-512 hash.
 */
export default function sha512(data) {
	const hash = createHash("sha512");
	hash.update(data);
	return hash.digest("hex");
}
