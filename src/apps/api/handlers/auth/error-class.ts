export class AuthHandlerError extends Error {
	replyStatusCode = 401;
	uniqueCode: string;

	constructor(uniqueCode: string, message: string) {
		super(message);
		this.uniqueCode = uniqueCode;
	}

	static createCookieNotFoundError() {
		return new AuthHandlerError("Unauthorized", "No cookies found");
	}

	static createInvalidTokenError() {
		return new AuthHandlerError("Unauthorized", "Invalid token");
	}
}
