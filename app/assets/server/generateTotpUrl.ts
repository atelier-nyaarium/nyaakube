import { otpauthURL } from "@levminer/speakeasy";

/**
 * Generates a TOTP URL
 *
 * @param issuerLabel - Label for the issuer.
 * @param userLabel - Label for the user.
 * @param digits - Number of digits for the TOTP.
 * @param period - Period for the TOTP.
 * @param secret - Secret key for the TOTP.
 *
 * @returns The TOTP URL.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * generateTotpUrl("Company Name", "user@email", 6, 30, "ABC");
 * -> "otpauth://totp/Company%20Name:user@email?secret= . . . "
 */
export function generateTotpUrl(
	issuerLabel: string,
	userLabel: string,
	digits: number,
	period: number,
	secret: string,
): string {
	if (typeof issuerLabel !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, secret) : 'issuerLabel' must be a string.`,
		);
	}

	if (typeof userLabel !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, secret) : 'userLabel' must be a string.`,
		);
	}

	if (typeof digits !== "number") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, secret) : 'digits' must be a number.`,
		);
	}

	if (typeof period !== "number") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, secret) : 'period' must be a number.`,
		);
	}

	if (typeof secret !== "string") {
		throw new TypeError(
			`generateTotpUrl(issuerLabel, userLabel, digits, period, secret) : 'secret' must be a string.`,
		);
	}

	return otpauthURL({
		encoding: "base32",
		algorithm: "sha1",
		issuer: encodeURIComponent(issuerLabel),
		label: encodeURIComponent(userLabel),
		digits,
		period,
		secret,
	});
}
