import { DefaultUseCaseError } from "./_base-class.js";

export class SlotNotAvailable extends DefaultUseCaseError {
	static uniqueCode = "SLOT_NOT_AVAILABLE";

	constructor() {
		super(
			SlotNotAvailable.uniqueCode,
			"The selected time slot is not available",
		);
	}
}
