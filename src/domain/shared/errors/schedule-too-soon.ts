import { DefaultUseCaseError } from "./_base-class.js";

export class ScheduleTooSoon extends DefaultUseCaseError {
	static uniqueCode = "SCHEDULE_TOO_SOON";

	constructor() {
		super(
			ScheduleTooSoon.uniqueCode,
			"The schedule date is too soon. Please select a later time.",
		);
	}
}
