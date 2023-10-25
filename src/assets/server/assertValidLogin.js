import { UnauthorizedError } from "@/assets/common/ErrorTypes";
import { pause } from "@/assets/common/pause";
import { getEnv } from "@/assets/server/getEnv";
import { validateTOTP } from "@/assets/server/validateTOTP";
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
 * @returns {Promise<void>} - Resolves when the validation is successful.
 *
 * @throws {TypeError} If the parameter types are incorrect.
 * @throws {UnauthorizedError} If the email, password or TOTP token is invalid.
 * @throws {Error} If there is some other error.
 *
 * @example
 * try {
 *   await assertValidLogin("foo", "bar", "123456");
 *   console.log("Login successful");
 * } catch (error) {
 *   console.error("Login failed:", error);
 * }
 */
export async function assertValidLogin(email, password, totpToken = undefined) {
	if (typeof email !== "string") {
		throw new TypeError(
			`assertValidLogin(email, password, totpToken?) : 'email' must be a string.`,
		);
	}

	if (typeof password !== "string") {
		throw new TypeError(
			`assertValidLogin(email, password, totpToken?) : 'password' must be a string.`,
		);
	}

	if (totpToken !== undefined && typeof totpToken !== "string") {
		throw new TypeError(
			`assertValidLogin(email, password, totpToken?) : 'totpToken' is optional, but must be a string.`,
		);
	}

	let user;
	try {
		user = await getUserByEmail(saslPrep(email));
	} catch (error) {
		console.error("Error getting user by getUserByEmail()", error);
		throw new Error("Internal server error.");
	}
	if (!user) {
		await randomSleep();
		throw new UnauthorizedError(
			"Invalid email or password (or TOTP if used).",
		);
	}

	if (user.totp && !totpToken) {
		await randomSleep();
		throw new UnauthorizedError("TOTP token required.");
	}

	const passwordMatch = await argon2.verify(
		user.password,
		saslPrep(password),
	);
	if (!passwordMatch) {
		await randomSleep();
		throw new UnauthorizedError(
			"Invalid email or password (or TOTP if used).",
		);
	}

	if (user.totp) {
		const validTotp = await validateTOTP(user.totp, saslPrep(totpToken));
		if (!validTotp.valid) {
			if (validTotp.code === 401) {
				// Already sleeps when 401
				throw new UnauthorizedError(
					"Invalid email or password (or TOTP if used).",
				);
			} else {
				// Only provide message if the request format is bad.
				await randomSleep();
				throw new Error(validTotp.message);
			}
		}
	}

	return {
		email: user.email,
		roles: user.roles,
	};
}

async function getUserByEmail(email) {
	if (typeof email !== "string") throw new Error("Invalid email");
	email = email.trim().toLowerCase();
	if (!email) throw new Error("Invalid email");

	// TODO: Implement database, instead of a hardcoded user
	const ADMIN_EMAIL = getEnv("ADMIN_EMAIL")?.toLowerCase?.();
	const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD");
	const ADMIN_TOTP = getEnv("ADMIN_TOTP");
	if (ADMIN_EMAIL) {
		if (email === ADMIN_EMAIL) {
			return {
				id: 1,
				email: ADMIN_EMAIL,
				password: ADMIN_PASSWORD,
				totp: ADMIN_TOTP,
				roles: {
					admin: {},
				},
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
