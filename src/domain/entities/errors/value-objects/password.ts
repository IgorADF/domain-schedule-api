import { DefaultEntityError } from "../_default.js";

export class InvalidPasswordLength extends DefaultEntityError {
  constructor() {
    super(
      "Password must be at least 6 characters long",
      "InvalidPasswordLength",
      "Password"
    );
  }
}
