import { DefaultUseCaseError } from "./_base-class.js";

export class EntityAlreadyExist extends DefaultUseCaseError {
	static uniqueCode = "ENTITY_ALREADY_EXIST";

	constructor() {
		super(EntityAlreadyExist.uniqueCode, "Entity already exists");
	}
}
