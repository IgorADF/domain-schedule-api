import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import { QueueService } from "@/infra/services/queue.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = (logService) => {
	const uow = DrizzleUnitOfWork.create();
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
