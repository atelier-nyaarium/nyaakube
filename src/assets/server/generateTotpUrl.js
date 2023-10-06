import speakeasy from "@levminer/speakeasy";

const issuer = `Atelier Nyaarium`;

/**
 * Generates a TOTP URL for a given label, digits, period, step, and secret.
 *
 * @param {string} label - Label for the TOTP URL.
 * @param {number} digits - Number of digits for the TOTP.
 * @param {number} period - Period for the TOTP.
 * @param {number} step - Steps for the TOTP.
 * @param {string} secret - Secret key for the TOTP.
 *
 * @returns {string} The TOTP URL.
 */
export default function generateTotpUrl(label, digits, period, step, secret) {
	return speakeasy.otpauthURL({
		encoding: "base32",
		// algorithm: "SHA1",
		issuer,
		label,
		digits,
		period,
		step,
		secret,
	});
}
