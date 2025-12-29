import { DefaultUseCaseError } from "./_default.js";

export class InvalidCreantionData extends DefaultUseCaseError {
	constructor() {
		super("Invalid creation data");
	}
}
