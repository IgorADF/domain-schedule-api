import type z from "zod";
import { SellerWithPasswordSchema } from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.interface.js";
import type { ILogService } from "../services/log.interface.js";
import type { IHashPasswordService } from "../services/password.js";
import { InvalidCredentials } from "../shared/errors/invalid-credentials.js";

export const AuthSellerSchema = SellerWithPasswordSchema.pick({
	email: true,
	password: true,
});

export type AuthSellerType = z.infer<typeof AuthSellerSchema>;

export class AuthSellerUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly passwordService: IHashPasswordService,
		private readonly logService?: ILogService,
	) {}

	async execute({ email, password }: AuthSellerType) {
		const existingSeller =
			await this.uow.sellerRepository.getSellerWithPassword(email);

		if (!existingSeller) {
			this.logService?.print(
				`Authentication failed for email: ${email}`,
				"warn",
			);
			throw new InvalidCredentials();
		}

		const isSamePassword = this.passwordService.comparePassword(
			password,
			existingSeller.password,
		);

		if (!isSamePassword) {
			this.logService?.print(
				`Authentication failed for email: ${email} - Incorrect password`,
				"warn",
			);
			throw new InvalidCredentials();
		}

		return { sellerId: existingSeller.id, email: existingSeller.email };
	}
}
