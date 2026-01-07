import { DefaultUseCaseError } from "./_default.js";

export class InvalidCreantionData extends DefaultUseCaseError {
	static uniqueCode = "INVALID_CREATION_DATA";

	constructor() {
		super(InvalidCreantionData.uniqueCode, "Invalid creation data");
	}
}
