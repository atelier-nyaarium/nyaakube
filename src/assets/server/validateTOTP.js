import { pause } from "@/assets/common/pause";
import speakeasy from "@levminer/speakeasy";

/**
 * Validates a TOTP token
 *
 * @param {string} totpSecret - The TOTP config/secret string.
 * @param {string} token - The TOTP token from input.
 *
 * @returns {Promise<{
 *     valid: boolean,
 *     code?: number,
 *     message?: string,
 * }>} - Resolves to an object with the results.
 *
 * @throws TypeError if the parameter types are bad.
 *
 * @example
 * const totpSecret = "6,30,60,ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 * const resValid = await validateTOTP(totpSecret, "123456");
 * -> { valid: true }
 */
export async function validateTOTP(totpSecret, token) {
	try {
		if (typeof totpSecret !== "string") {
			throw new TypeError(
				`validateTOTP(totpSecret, token) : 'totpSecret' must be a string.`,
			);
		}

		const split = totpSecret.split(",").map((s) => s.trim());
		if (split.length !== 4) {
			throw new TypeError(
				`validateTOTP(totpSecret, token) : 'totpSecret' must be in the format: 'DIGITS,PERIOD,WINDOW,SECRET'.`,
			);
		}

		// eslint-disable-next-line prefer-const
		let [digits, period, window, secret] = split;

		digits = parseInt(digits);
		period = parseInt(period);
		window = parseInt(window);
		if (isNaN(digits) || isNaN(period) || isNaN(window)) {
			throw new TypeError(
				`validateTOTP(totpSecret, token) : 'totpSecret' must be in the format: 'DIGITS,PERIOD,WINDOW,SECRET'.`,
			);
		}

		if (!token) {
			return {
				valid: false,
				code: 403,
				message: `An access token is required for this page.`,
			};
		}

		token = String(token);

		// Give vague expectation about token length
		if (token.length < 6 || 10 < token.length) {
			return {
				valid: false,
				code: 400,
				message: `Expected a TOTP token (numbers-only, 6 to 10 digits).`,
			};
		}

		// eslint-disable-next-line security/detect-non-literal-regexp
		if (!new RegExp(`^\\d{${digits}}$`).test(token)) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: `Invalid TOTP token.`,
			};
		}

		const isValid = speakeasy.totp.verify({
			encoding: "base32",
			digits,
			// ⚠️ Speakeasy uses step instead of window
			// ⚠️ Speak easy flips the terminology of period and step
			period: window,
			step: period,
			secret,
			token,
		});

		if (isValid) {
			return {
				valid: true,
			};
		} else {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: `Invalid TOTP token.`,
			};
		}
	} catch (error) {
		console.error(error);
		return {
			valid: false,
			code: 500,
			message: "Internal server error.",
		};
	}
}

// Randomize reply time
const R = ((Math.random() * 1000) | 0) + 50;
const randomSleep = () => {
	return pause(R + Math.random() * 1000);
};
