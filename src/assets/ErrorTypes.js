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
	 * @param {string} [message] - The error message. Pass a message to override the default.
	 */
	constructor(message = undefined) {
		message ??= "[401] Unauthorized. Please sign in and try again.";
		super(message);
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
	 * @param {string} [message] - The error message. Pass a message to override the default.
	 */
	constructor(message = undefined) {
		message ??=
			"[403] Access Denied. You do not have permission to access this resource.";
		super(message);
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
	 * @param {string} [message] - The error message. Pass a message to override the default.
	 */
	constructor(message = undefined) {
		message ??=
			"[429] Too Many Requests. You have sent too many requests in a given amount of time.";
		super(message);
	}
}
