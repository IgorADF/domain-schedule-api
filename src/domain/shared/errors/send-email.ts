import { DefaultUseCaseError } from "./_base-class.js";

export class SendEmailError extends DefaultUseCaseError {
	static uniqueCode = "SEND_EMAIL_ERROR";

	constructor() {
		super(SendEmailError.uniqueCode, "Error sending email");
	}
}
