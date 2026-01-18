import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const updateSellerFactory: CreateFactoryFunction<UpdateSellerUseCase> = (
	dbClient,
) => {
	const { uow } = createUowFactory(dbClient);
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
