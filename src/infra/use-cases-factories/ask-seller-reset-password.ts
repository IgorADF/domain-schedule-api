import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import { QueueService } from "@/infra/services/queue.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = (dbClient, logService) => {
	const { uow } = createUowFactory(dbClient);
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
