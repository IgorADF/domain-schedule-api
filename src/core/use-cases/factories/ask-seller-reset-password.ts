import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import type { CreateFactoryFunction } from "./_default.js";
import { createQueueService } from "@/core/services/factories/queue.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = () => {
	const uow = new SequelizeUnitOfWork();
	const queueService = createQueueService().service;
	const useCase = new AskSellerResetPasswordUseCase(uow, queueService);

	return {
		uow,
		useCase,
	};
};
