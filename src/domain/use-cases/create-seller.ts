import type z from "zod";
import { createEntity } from "../entities/helpers/creation.js";
import {
	maxPasswordCreationLength,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import type { IPasswordService } from "../services/password.js";
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
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly passwordService: IPasswordService,
	) {}

	async execute(input: CreateSellerType): Promise<{ data: SellerType }> {
		const existingSeller = await this.uow.sellerRepository.getSellerByEmail(
			input.email,
		);

		if (existingSeller) {
			throw new EntityAlreadyExist();
		}

		const formattedNewSeller = this.formatNewSeller(input);

		const newSeller = await this.uow.withTransaction(async () => {
			return await this.uow.sellerRepository.create(formattedNewSeller);
		});

		return { data: newSeller };
	}

	formatNewSeller(newSeller: CreateSellerType): SellerWithPasswordSchemaType {
		const seller = createEntity<SellerWithPasswordSchemaType>({
			...newSeller,
			password: this.passwordService.hashPassword(newSeller.password),
			deleteDate: null,
		});

		const parsedNewSeller = SellerWithPasswordSchema.parse(seller);
		return parsedNewSeller;
	}
}
