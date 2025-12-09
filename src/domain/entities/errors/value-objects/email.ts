import { DefaultEntityError } from "../_default.js";

export class InvalidEmailFormat extends DefaultEntityError {
  constructor() {
    super("Invalid email format", "InvalidEmailFormat", "Email");
  }
}
