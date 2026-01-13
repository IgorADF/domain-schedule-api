import type z from "zod";
import { updateEntity } from "../entities/helpers/update.js";
import {
	type SellerType,
	SellerWithPasswordSchema,
} from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import { EntityAlreadyExist } from "../shared/errors/entity-already-exist.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";

export const UpdateSellerSchema = SellerWithPasswordSchema.pick({
	id: true,
	email: true,
	name: true,
});

export type UpdateSellerType = z.infer<typeof UpdateSellerSchema>;

export class UpdateSellerUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute(sellerData: UpdateSellerType): Promise<{ data: SellerType }> {
		const existingSeller = await this.uow.sellerRepository.getSellerById(
			sellerData.id,
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

		let updateData: Partial<SellerType> = {};

		if (sellerData.email !== undefined) {
			updateData.email = sellerData.email;
		}
		if (sellerData.name !== undefined) {
			updateData.name = sellerData.name;
		}

		updateData = updateEntity<SellerType>({
			...updateData,
		});

		const updatedSeller = await this.uow.sellerRepository.updateSeller(
			sellerData.id,
			updateData,
		);

		return { data: updatedSeller };
	}
}
