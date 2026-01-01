import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import { createQueueService } from "@/infra/services/factories/queue.js";
import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import type { CreateFactoryFunction } from "./_default.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const queueService = createQueueService().service;
	const useCase = new AskSellerResetPasswordUseCase(uow, queueService);

	return {
		uow,
		useCase,
	};
};
