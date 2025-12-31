import { comparePasswords } from "@core/utils/password.js";
import type z from "zod";
import { SellerSchema } from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import type { IEmailService } from "../services/email.interace.js";
import { InvalidCredentials } from "../shared/errors/invalid-credentials.js";
import { SendEmailError } from "../shared/errors/send-email.js";

export const AskSellerResetPasswordSchema = SellerSchema.pick({
	email: true,
});

export type AskSellerResetPasswordType = z.infer<
	typeof AskSellerResetPasswordSchema
>;

export class AskSellerResetPasswordUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly emailService: IEmailService,
	) {}

	async execute(
		{ email }: AskSellerResetPasswordType,
		jwtFunction: (payload: { id: string; email: string }) => Promise<string>,
	) {
		const existingSeller =
			await this.uow.sellerRepository.getSellerWithPassword(email);

		if (!existingSeller) {
			throw new InvalidCredentials();
		}

		const token = await jwtFunction({
			id: existingSeller.id,
			email: existingSeller.email,
		});

		const emailTemplate = this.createEmailTemplate(token);
		await this.sendResetEmail(email, emailTemplate);
	}

	private createEmailTemplate(token: string) {
		return `
		<html>
		  <body>
			<h1>Password Reset Request</h1>
			<p>Click the link below to reset your password:</p>
			<a href="https://yourapp.com/reset-password?token=${token}">Reset Password</a>
		  </body>
		</html>
	  `;
	}

	private async sendResetEmail(email: string, template: string) {
		const { success } = await this.emailService.send(
			email,
			"Password Reset Request",
			template,
		);

		if (!success) {
			throw new SendEmailError();
		}
	}
}
