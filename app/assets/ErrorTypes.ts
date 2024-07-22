/**
 * Unauthorized Error
 *
 * A request did not provide the required authentication.
 *
 * @extends Error
 */
export class UnauthorizedError extends Error {
	/**
	 * Create an UnauthorizedError.
	 *
	 * @param message - The error message. Pass a message to override the default.
	 */
	constructor(
		message: string = "[401] Unauthorized. Please sign in and try again.",
	) {
		super(message);
		this.name = "UnauthorizedError";
	}
}

/**
 * Access Denied Error
 *
 * The authenticated user does not have permissions for the request.
 *
 * @extends Error
 */
export class AccessDeniedError extends Error {
	/**
	 * Create an AccessDeniedError.
	 *
	 * @param message - The error message. Pass a message to override the default.
	 */
	constructor(
		message: string = "[403] Access Denied. You do not have permission to access this resource.",
	) {
		super(message);
		this.name = "AccessDeniedError";
	}
}

/**
 * Too Many Requests Error
 *
 * The user has sent too many requests in a given amount of time.
 *
 * @extends Error
 */
export class TooManyRequestsError extends Error {
	/**
	 * Create a TooManyRequestsError.
	 *
	 * @param message - The error message. Pass a message to override the default.
	 */
	constructor(
		message: string = "[429] Too Many Requests. You have sent too many requests in a given amount of time.",
	) {
		super(message);
		this.name = "TooManyRequestsError";
	}
}

/**
 * Not Found Error
 *
 * The requested resource could not be found.
 *
 * @extends Error
 */
export class NotFoundError extends Error {
	/**
	 * Create a NotFoundError.
	 *
	 * @param message - The error message. Pass a message to override the default.
	 */
	constructor(
		message: string = "[404] Not Found. The requested resource could not be found.",
	) {
		super(message);
		this.name = "NotFoundError";
	}
}
