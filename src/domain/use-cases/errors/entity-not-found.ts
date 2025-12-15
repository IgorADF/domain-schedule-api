import { DefaultUseCaseError } from "./_default.js";

export class EntityNotFound extends DefaultUseCaseError {
  constructor() {
    super("Entity not found");
  }
}
