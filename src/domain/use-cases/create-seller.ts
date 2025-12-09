import { Seller } from "../entities/seller.js";
import { Email } from "../entities/value-objects/email.js";
import { Password } from "../entities/value-objects/password.js";
import { SellerRepository } from "../repositories/seller.interface.js";
import { EntityAlreadyExist } from "./errors/entity-already-exist.js";

interface CreateSellerProps {
  email: Email;
  password: Password;
}

export class CreateSellerUseCase {
  constructor(private sellerRepository: SellerRepository) {}

  async execute({ email, password }: CreateSellerProps): Promise<Seller> {
    const existingSeller = await this.sellerRepository.getSeller(email.value);
    if (existingSeller) {
      throw new EntityAlreadyExist();
    }

    const newSeller = await this.sellerRepository.createSeller({
      email: email.value,
      password: password.hashValue,
    });

    return newSeller;
  }
}
