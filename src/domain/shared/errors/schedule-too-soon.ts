import { DefaultUseCaseError } from "./_default.js";

export class ScheduleTooSoon extends DefaultUseCaseError {
	constructor() {
		super("The schedule date is too soon. Please select a later time.");
	}
}
