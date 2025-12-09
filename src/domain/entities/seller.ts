import z from "zod";
import { DefaultEntity } from "./_default.js";
import { Email } from "./value-objects/email.js";
import { Password } from "./value-objects/password.js";

export interface SellerProps {
  email: Email;
  password: Password;
}

export class Seller extends DefaultEntity<SellerProps> {
  static create(props: SellerProps, id?: string): Seller {
    return new Seller(props, id);
  }
}

export const SellerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type SellerType = z.infer<typeof SellerSchema>;
