import type z from "zod";
import { SellerSchema } from "../entities/seller.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.interface.js";
import type { ILogService } from "../services/log.interface.js";
import type { iQueueService } from "../services/queue.interface.js";
import {
	SystemLanguages,
	type SystemLanguagesType,
} from "../shared/value-objects/system-languages.js";

export const AskSellerResetPasswordSchema = SellerSchema.pick({
	email: true,
}).extend({
	language: SystemLanguages,
});

export type AskSellerResetPasswordType = z.infer<
	typeof AskSellerResetPasswordSchema
>;

export class AskSellerResetPasswordUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly queueService: iQueueService,
		private readonly logService?: ILogService,
	) {}

	async execute(
		{ email, language }: AskSellerResetPasswordType,
		jwtFunction: (payload: { id: string; email: string }) => string,
	) {
		const existingSeller =
			await this.uow.sellerRepository.getSellerWithPassword(email);

		if (!existingSeller) {
			return;
		}

		const token = await jwtFunction({
			id: existingSeller.id,
			email: existingSeller.email,
		});

		const emailTemplate = this.createEmailTemplate(token, language);

		try {
			await this.queueService.sendEmail({
				to: email,
				subject: "Password Reset Request",
				html: emailTemplate,
			});
		} catch (error) {
			this?.logService?.error(
				"AskSellerResetPasswordUseCase: Error sending reset password email: " +
					JSON.stringify(error),
			);
		}
	}

	private createEmailTemplate(token: string, language: SystemLanguagesType) {
		if (language === "pt") {
			return `
		<html>
		  <body>
			<h1>Solicitação de Redefinição de Senha</h1>
			<p>Clique no link abaixo para redefinir sua senha:</p>
			<a href="https://yourapp.com/reset-password?token=${token}">Redefinir Senha</a>
		  </body>
		</html>
	  `;
		}

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
}
