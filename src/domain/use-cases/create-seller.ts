import type z from "zod";
import { createEntity } from "../entities/helpers/creation.js";
import {
	maxPasswordCreationLength,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import type { IHashPasswordService } from "../services/password.js";
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
		private readonly passwordService: IHashPasswordService,
	) {}

	async execute(input: CreateSellerType): Promise<{ seller: SellerType }> {
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

		return { seller: newSeller };
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
