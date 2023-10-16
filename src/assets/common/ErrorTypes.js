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
	constructor(message = "Please sign in and try again.") {
		super(message);
		this.name = "Unauthorized";
		this.code = 401;
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
	constructor(
		message = "You do not have permission to access this resource.",
	) {
		super(message);
		this.name = "Access Denied";
		this.code = 403;
	}
}
