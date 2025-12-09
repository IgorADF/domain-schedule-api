import bcrypt from "bcryptjs";
import { InvalidPasswordLength } from "../errors/value-objects/password.js";

export class Password {
  private rawValue: string;
  public hashValue: string;

  constructor(rawValue: string) {
    if (rawValue.length < 6) {
      throw new InvalidPasswordLength();
    }

    this.rawValue = rawValue;
    this.hashValue = bcrypt.hashSync(this.rawValue, 10);
  }

  // comparePassword(hashValue: string): boolean {
  //   return;
  // }
}
