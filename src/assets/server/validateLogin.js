import { pause } from "@/assets/common";
import { getEnv, validateTOTP } from "@/assets/server";
import argon2 from "argon2";
import saslPrep from "saslprep";

/**
 * Validates user login credentials
 *
 * 🚧 [WIP] Currently just has a hardcoded Admin account with TOTP. Implement this when users are needed.
 *
 * @param {string} email - The email of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @param {string} [totpToken] - The TOTP token from the user attempting to log in.
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
 * const resValid = await validateLogin("foo", "bar", "123456");
 * -> { valid: true }
 */
export async function validateLogin(email, password, totpToken = undefined) {
	try {
		if (typeof email !== "string") {
			throw new TypeError(
				`validateLogin(email, password, totpToken?) : 'email' must be a string.`,
			);
		}

		if (typeof password !== "string") {
			throw new TypeError(
				`validateLogin(email, password, totpToken?) : 'password' must be a string.`,
			);
		}

		if (totpToken !== undefined && typeof totpToken !== "string") {
			throw new TypeError(
				`validateLogin(email, password, totpToken?) : 'totpToken' is optional, but must be a string.`,
			);
		}

		const user = await getUserByEmail(saslPrep(email));
		if (!user) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "Invalid email or password.",
			};
		}

		if (user.totp && !totpToken) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "TOTP token required.",
			};
		}

		const passwordMatch = await argon2.verify(
			user.password,
			saslPrep(password),
		);
		if (!passwordMatch) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "Invalid email or password.",
			};
		}

		const validTotp = await validateTOTP(user.totp, saslPrep(totpToken));
		if (!validTotp.valid) return validTotp;

		return {
			valid: true,
		};
	} catch (error) {
		console.error("Error validating login:", error);
		await randomSleep();
		return {
			valid: false,
			code: 500,
			message: "Internal server error.",
		};
	}
}

async function getUserByEmail(email) {
	if (typeof email !== "string") throw new Error("Invalid email");
	email = email.trim().toLowerCase();
	if (!email) throw new Error("Invalid email");

	// TODO: Implement database for other users

	const ADMIN_EMAIL = getEnv("ADMIN_EMAIL")?.toLowerCase?.();
	const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD")?.toLowerCase?.();
	const ADMIN_TOTP = getEnv("ADMIN_TOTP")?.toLowerCase?.();
	if (ADMIN_EMAIL) {
		if (email === ADMIN_EMAIL) {
			return {
				id: 1,
				email: ADMIN_EMAIL,
				password: ADMIN_PASSWORD,
				totp: ADMIN_TOTP,
				roles: [],
			};
		}
	}

	return null;
}

// Randomize reply time to prevent timing attacks
const R = ((Math.random() * 1000) | 0) + 50;
const randomSleep = () => {
	return pause(R + Math.random() * 1000);
};
