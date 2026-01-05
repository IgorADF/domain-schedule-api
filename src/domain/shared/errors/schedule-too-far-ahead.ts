import { DefaultUseCaseError } from "./_default.js";

export class ScheduleTooFarAhead extends DefaultUseCaseError {
	constructor() {
		super(
			"The schedule date is too far in the future. Please select an earlier date.",
		);
	}
}
