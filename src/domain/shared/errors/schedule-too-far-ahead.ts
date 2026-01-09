import { DefaultUseCaseError } from "./_base-class.js";

export class ScheduleTooFarAhead extends DefaultUseCaseError {
	static uniqueCode = "SCHEDULE_TOO_FAR_AHEAD";

	constructor() {
		super(
			ScheduleTooFarAhead.uniqueCode,
			"The schedule date is too far in the future. Please select an earlier date.",
		);
	}
}
