import z from "zod";
import { SellerType } from "../entities/seller.js";
import { SellerRepository } from "../repositories/seller.interface.js";
import { EntityAlreadyExist } from "./errors/entity-already-exist.js";
import { hashPassword } from "../../core/utils/password.js";

export const CreateSellerSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(6),
});

export type CreateSellerType = z.infer<typeof CreateSellerSchema>;

export class CreateSellerUseCase {
  constructor(private sellerRepository: SellerRepository) {}

  async execute(newSellerToCreate: CreateSellerType): Promise<SellerType> {
    const existingSeller = await this.sellerRepository.getSeller(
      newSellerToCreate.email
    );

    if (existingSeller) {
      throw new EntityAlreadyExist();
    }

    const formatNewSeller = this.formatSellerToCreate(newSellerToCreate);
    const newSeller = await this.sellerRepository.createSeller(formatNewSeller);

    return newSeller;
  }

  formatSellerToCreate(newSeller: CreateSellerType): CreateSellerType {
    const formatNewSeller = structuredClone(newSeller);
    formatNewSeller.password = hashPassword(newSeller.password);

    return formatNewSeller;
  }
}
