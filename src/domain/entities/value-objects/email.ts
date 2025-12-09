import z from "zod";
import { InvalidEmailFormat } from "../errors/value-objects/email.js";

export class Email {
  value: string;
  constructor(value: string) {
    if (z.email().safeParse(value).success === false) {
      throw new InvalidEmailFormat();
    }

    this.value = value;
  }
}
