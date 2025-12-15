import z from "zod";
import { SellerType } from "../entities/seller.js";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { EntityNotFound } from "./errors/entity-not-found.js";
import { EntityAlreadyExist } from "./errors/entity-already-exist.js";

export const UpdateSellerSchema = z.object({
  id: z.uuid(),
  email: z.email().min(1).optional(),
  name: z.string().min(1).optional(),
});

export type UpdateSellerType = z.infer<typeof UpdateSellerSchema>;

export class UpdateSellerUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(_sellerData: UpdateSellerType): Promise<{ data: SellerType }> {
    const sellerData = UpdateSellerSchema.parse(_sellerData);

    const existingSeller = await this.uow.sellerRepository.getSellerById(
      sellerData.id
    );

    if (!existingSeller) {
      throw new EntityNotFound();
    }

    if (sellerData.email && sellerData.email !== existingSeller.email) {
      const sellerWithSameEmail =
        await this.uow.sellerRepository.getSellerByEmail(sellerData.email);

      if (sellerWithSameEmail) {
        throw new EntityAlreadyExist();
      }
    }

    const updateData: Partial<SellerType> = {};
    if (sellerData.email !== undefined) {
      updateData.email = sellerData.email;
    }
    if (sellerData.name !== undefined) {
      updateData.name = sellerData.name;
    }

    const updatedSeller = await this.uow.sellerRepository.updateSeller(
      sellerData.id,
      updateData
    );

    return { data: updatedSeller };
  }
}
