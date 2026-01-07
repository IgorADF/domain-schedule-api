import { DefaultUseCaseError } from "./_default.js";

export class EntityNotFound extends DefaultUseCaseError {
	static uniqueCode = "ENTITY_NOT_FOUND";

	constructor() {
		super(EntityNotFound.uniqueCode, "Entity not found");
	}
}
