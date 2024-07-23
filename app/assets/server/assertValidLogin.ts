import { verify } from "argon2";
import saslPrep from "saslprep";
import { UnauthorizedError } from "~/assets/ErrorTypes";
import { pause } from "~/assets/common/pause";
import { getEnv } from "~/assets/server/getEnv";
// import { validateTOTP } from "~/assets/server/validateTOTP";

interface User {
	id: number;
	email: string;
	password_hash: string;
	password_salt: number;
	totp?: string;
	roles: Record<string, any>;
}

interface TotpValidationResult {
	valid: boolean;
	code?: number;
	message?: string;
}

/**
 * Validates user login credentials
 *
 * 🚧 [WIP] Currently just has a hardcoded Admin account with TOTP. Implement this when users are needed.
 *
 * @param email - The email of the user attempting to log in.
 * @param password - The password of the user attempting to log in.
 * @param totpToken - The TOTP token from the user attempting to log in.
 *
 * @returns A promise that resolves when the validation is successful.
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
export async function assertValidLogin(
	email: string,
	password: string,
	totpToken?: string,
): Promise<{ email: string; roles: Record<string, any> }> {
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

	let user: User | null;
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

	const passwordMatch = await verify(user.password_hash, saslPrep(password));
	if (!passwordMatch) {
		await randomSleep();
		throw new UnauthorizedError(
			"Invalid email or password (or TOTP if used).",
		);
	}

	// BROKEN - Replace Speakeasy with something else. Or fork and fix it.
	// if (user.totp) {
	// 	const validTotp: TotpValidationResult = await validateTOTP(
	// 		user.totp,
	// 		saslPrep(totpToken!),
	// 	);
	// 	if (!validTotp.valid) {
	// 		if (validTotp.code === 401) {
	// 			// Already sleeps when 401
	// 			throw new UnauthorizedError(
	// 				"Invalid email or password (or TOTP if used).",
	// 			);
	// 		} else {
	// 			// Only provide message if the request format is bad.
	// 			await randomSleep();
	// 			throw new Error(validTotp.message || "TOTP validation failed.");
	// 		}
	// 	}
	// }

	return {
		email: user.email,
		roles: user.roles,
	};
}

async function getUserByEmail(email: string): Promise<User | null> {
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
				password_hash: ADMIN_PASSWORD,
				password_salt: 0,
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
