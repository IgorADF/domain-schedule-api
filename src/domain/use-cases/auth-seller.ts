import z from "zod";
import { InvalidCredentials } from "./errors/invalid-credentials.js";
import { comparePasswords } from "../../core/utils/password.js";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";

export const AuthSellerSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type AuthSellerType = z.infer<typeof AuthSellerSchema>;

export class AuthSellerUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute({ email, password }: AuthSellerType) {
    const existingSeller = await this.uow.sellerRepository.getSeller(email);

    if (!existingSeller) {
      throw new InvalidCredentials();
    }

    const isSamePassword = comparePasswords(password, existingSeller.password);

    if (!isSamePassword) {
      throw new InvalidCredentials();
    }

    return { seller_id: existingSeller.id, email: existingSeller.email };
  }
}
