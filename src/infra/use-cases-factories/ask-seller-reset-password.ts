import { AskSellerResetPasswordUseCase } from "@/domain/use-cases/ask-seller-reset-password.js";
import { QueueService } from "@/infra/services/queue.js";
import { PrismaUnitOfWork } from "../repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const askSellerResetPasswordFactory: CreateFactoryFunction<
	AskSellerResetPasswordUseCase
> = (dbClient, logService) => {
	const uow = PrismaUnitOfWork.create(dbClient);
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
