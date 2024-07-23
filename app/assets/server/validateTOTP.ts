import { totp } from "@levminer/speakeasy";
import { pause } from "~/assets/common/pause";

interface ValidationResult {
	valid: boolean;
	code?: number;
	message?: string;
}

/**
 * Validates a TOTP token
 *
 * @param totpSecret - The TOTP config/secret string.
 * @param token - The TOTP token from input.
 *
 * @returns Resolves to an object with the results.
 *
 * @throws TypeError if the parameter types are incorrect.
 *
 * @example
 * const totpSecret = "6,30,60,ABCDEFGHIJKLMNOPQRSTUVWXYZ";
 * const resValid = await validateTOTP(totpSecret, "123456");
 * -> { valid: true }
 */
export async function validateTOTP(
	totpSecret: string,
	token: string,
): Promise<ValidationResult> {
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

		let [digits, period, window, secret] = split;

		const digitsNum = parseInt(digits);
		const periodNum = parseInt(period);
		const windowNum = parseInt(window);
		if (isNaN(digitsNum) || isNaN(periodNum) || isNaN(windowNum)) {
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
		if (token.length < 6 || token.length > 10) {
			return {
				valid: false,
				code: 400,
				message: `Expected a TOTP token (numbers-only, 6 to 10 digits).`,
			};
		}

		if (!new RegExp(`^\\d{${digitsNum}}$`).test(token)) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: `Invalid TOTP token.`,
			};
		}

		const isValid = totp.verify({
			encoding: "base32",
			digits: digitsNum,
			// ⚠️ Speakeasy uses step instead of window
			// ⚠️ Speak easy flips the terminology of period and step
			// @ts-ignore - The TypeScript types may not exist yet
			period: windowNum,
			step: periodNum,
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
