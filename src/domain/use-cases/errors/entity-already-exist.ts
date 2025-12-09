import { DefaultUseCaseError } from "./_default.js";

export class EntityAlreadyExist extends DefaultUseCaseError {
  constructor() {
    super("Entity already exists");
  }
}
