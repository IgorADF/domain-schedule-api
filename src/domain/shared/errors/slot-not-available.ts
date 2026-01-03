import { DefaultUseCaseError } from "./_default.js";

export class SlotNotAvailable extends DefaultUseCaseError {
	constructor() {
		super("The selected time slot is not available");
	}
}
