import speakeasy from "@levminer/speakeasy";

/**
 * Generates a TOTP URL
 *
 * @param {string} issuerLabel - Label for the issuer.
 * @param {string} userLabel - Label for the user.
 * @param {number} digits - Number of digits for the TOTP.
 * @param {number} period - Period for the TOTP.
 * @param {number} step - Steps for the TOTP.
 * @param {string} secret - Secret key for the TOTP.
 *
 * @returns {string} The TOTP URL.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * generateTotpUrl("Foo Bar:user@email", 6, 30, 30, "ABC");
 * -> "otpauth://totp/Foo%20Bar:user@email?digits=6&period=30&step=30&secret=ABC&issuer=Atelier%20Nyaarium"
 */
export function generateTotpUrl(
	issuerLabel,
	userLabel,
	digits,
	period,
	step,
	secret,
) {
	if (typeof issuerLabel !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'issuerLabel' must be a string.`,
		);
	}

	if (typeof userLabel !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'userLabel' must be a string.`,
		);
	}

	if (typeof digits !== "number") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'digits' must be a number.`,
		);
	}

	if (typeof period !== "number") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'period' must be a number.`,
		);
	}

	if (typeof step !== "number") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'step' must be a number.`,
		);
	}

	if (typeof secret !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, step, secret) : 'secret' must be a string.`,
		);
	}

	return speakeasy.otpauthURL({
		encoding: "base32",
		algorithm: "SHA1",
		issuer: encodeURIComponent(issuerLabel),
		label: encodeURIComponent(userLabel),
		digits,
		period,
		step,
		secret: encodeURIComponent(secret),
	});
}
