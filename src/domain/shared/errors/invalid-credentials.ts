import { DefaultUseCaseError } from "./_base-class.js";

export class InvalidCredentials extends DefaultUseCaseError {
	static uniqueCode = "INVALID_CREDENTIALS";

	constructor() {
		super(InvalidCredentials.uniqueCode, "Invalid credentials");
	}
}
