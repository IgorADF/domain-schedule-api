import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";
import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import { EmailService } from "@/core/services/email.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = () => {
	const uow = new SequelizeUnitOfWork();
	const emailService = new EmailService();
	const useCase = new AskSellerResetPasswordUseCase(uow, emailService);

	return {
		uow,
		useCase,
	};
};
