import { DefaultUseCaseError } from "./_default.js";

export class SendEmailError extends DefaultUseCaseError {
	constructor() {
		super("Error sending email");
	}
}
