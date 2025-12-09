import { DefaultUseCaseError } from "./_default.js";

export class InvalidCredentials extends DefaultUseCaseError {
  constructor() {
    super("Invalid credentials");
  }
}
