import z from "zod";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import type { ILogService } from "../services/log.interface.js";
import type { IPasswordService } from "../services/password.js";
import { InvalidCredentials } from "../shared/errors/invalid-credentials.js";

export const AuthSellerSchema = z.object({
	email: z.email(),
	password: z.string(),
});

export type AuthSellerType = z.infer<typeof AuthSellerSchema>;

export class AuthSellerUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly passwordService: IPasswordService,
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

		return {
			seller: { id: existingSeller.id, email: existingSeller.email },
		};
	}
}
