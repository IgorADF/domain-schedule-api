import { hashPassword } from "@core/utils/password.js";
import { uuidv7 } from "uuidv7";
import type z from "zod";
import {
	maxPasswordCreationLength,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { EntityAlreadyExist } from "../shared/errors/entity-already-exist.js";

export const CreateSellerSchema = SellerWithPasswordSchema.pick({
	name: true,
	email: true,
	password: true,
}).refine((data) => data.password.length <= maxPasswordCreationLength, {
	message: `Password must be at most ${maxPasswordCreationLength} characters long`,
	path: ["password"],
});

export type CreateSellerType = z.infer<typeof CreateSellerSchema>;

export class CreateSellerUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute(input: CreateSellerType): Promise<{ data: SellerType }> {
		const existingSeller = await this.uow.sellerRepository.getSellerByEmail(
			input.email,
		);

		if (existingSeller) {
			throw new EntityAlreadyExist();
		}

		const formattedNewSeller = this.formatNewSeller(input);

		try {
			await this.uow.beginTransaction();

			const newSeller =
				await this.uow.sellerRepository.createSeller(formattedNewSeller);

			await this.uow.commitTransaction();

			return { data: newSeller };
		} catch (err) {
			await this.uow.rollbackTransaction();
			throw err;
		}
	}

	formatNewSeller(newSeller: CreateSellerType): SellerWithPasswordSchemaType {
		const now = new Date();

		const formatNewSeller: SellerWithPasswordSchemaType = {
			...newSeller,
			password: hashPassword(newSeller.password),

			id: uuidv7(),
			createdAt: now,
			updatedAt: now,
		};

		const parsedNewSeller = SellerWithPasswordSchema.parse(formatNewSeller);
		return parsedNewSeller;
	}
}
