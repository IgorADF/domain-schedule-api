import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const createSellerFactory: CreateFactoryFunction<CreateSellerUseCase> = (
	dbClient,
) => {
	const { uow } = createUowFactory(dbClient);
	const service = HashPasswordService.create();
	const useCase = new CreateSellerUseCase(uow, service);

	return {
		uow,
		useCase,
	};
};
