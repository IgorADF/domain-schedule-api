import z from "zod";
import { uuidv7 } from "uuidv7";
import {
  SellerType,
  SellerWithPasswordSchema,
  SellerWithPasswordSchemaType,
} from "../entities/seller.js";
import { EntityAlreadyExist } from "./errors/entity-already-exist.js";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";

export const CreateSellerSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  password: z.string().min(6),
});

export type CreateSellerType = z.infer<typeof CreateSellerSchema>;

export class CreateSellerUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(
    newSellerToCreate: CreateSellerType
  ): Promise<{ data: SellerType }> {
    const existingSeller = await this.uow.sellerRepository.getSeller(
      newSellerToCreate.email
    );

    if (existingSeller) {
      throw new EntityAlreadyExist();
    }

    const formattedNewSeller = this.formatNewSeller(newSellerToCreate);
    const newSeller = await this.uow.sellerRepository.createSeller(
      formattedNewSeller
    );

    return { data: newSeller };
  }

  formatNewSeller(newSeller: CreateSellerType): SellerWithPasswordSchemaType {
    const now = new Date();

    const formatNewSeller: SellerWithPasswordSchemaType = {
      ...newSeller,

      id: uuidv7(),
      createAt: now,
      updatedAt: now,
    };

    const parsedNewSeller = SellerWithPasswordSchema.parse(formatNewSeller);
    return parsedNewSeller;
  }
}
