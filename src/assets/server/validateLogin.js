import sleep from "@/assets/common/sleep";
import getEnv from "@/assets/server/getEnv";
import validateTOTP from "@/assets/server/validateTOTP";
import argon2 from "argon2";

/**
 * Validates user login credentials.
 *
 * 🚧 [WIP] Currently just has a hardcoded Admin account with TOTP. Implement this when users are needed.
 *
 * @param {string} username - The username of the user attempting to log in.
 * @param {string} password - The password of the user attempting to log in.
 * @param {string} totpToken - The TOTP token of the user attempting to log in (optional).
 *
 * @returns {Promise<{
 *     valid: boolean,
 *     code?: number,
 *     message?: string,
 * }>} - A promise that resolves to an object with the results.
 */
export default async function validateLogin(username, password, totpToken) {
	try {
		const user = await getUserByUsername(username);
		if (!user) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "Invalid username or password",
			};
		}

		if (user.totp && !totpToken) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "TOTP token required",
			};
		}

		const passwordMatch = await argon2.verify(user.password, password);
		if (!passwordMatch) {
			await randomSleep();
			return {
				valid: false,
				code: 401,
				message: "Invalid username or password",
			};
		}

		const validTotp = await validateTOTP(user.totp, totpToken);
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
			message: "Internal server error",
		};
	}
}

async function getUserByUsername(username) {
	if (typeof username !== "string") throw new Error("Invalid username");
	username = username.trim().toLowerCase();
	if (!username) throw new Error("Invalid username");

	// TODO: Implement database for other users

	const ADMIN_USERNAME = getEnv("ADMIN_USERNAME")?.toLowerCase?.();
	const ADMIN_PASSWORD = getEnv("ADMIN_PASSWORD")?.toLowerCase?.();
	const ADMIN_TOTP = getEnv("ADMIN_TOTP")?.toLowerCase?.();
	if (ADMIN_USERNAME) {
		if (username === ADMIN_USERNAME) {
			return {
				id: 1,
				username: ADMIN_USERNAME,
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
	return sleep(R + Math.random() * 1000);
};
