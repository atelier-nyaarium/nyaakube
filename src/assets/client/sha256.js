import { createHash } from "crypto";

/**
 * Generates a SHA-256 hash of the provided data.
 *
 * @param {string} data - The data to be hashed.
 *
 * @returns {string} The generated SHA-256 hash.
 */
export default function sha256(data) {
	const hash = createHash("sha256");
	hash.update(data);
	return hash.digest("hex");
}
