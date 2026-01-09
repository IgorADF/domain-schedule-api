import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";
import { QueueService } from "@/infra/services/queue.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = (logService) => {
	const uow = SequelizeUnitOfWork.create();
	const queueService = QueueService.create();
	const useCase = new AskSellerResetPasswordUseCase(
		uow,
		queueService,
		logService,
	);

	return {
		uow,
		useCase,
	};
};
