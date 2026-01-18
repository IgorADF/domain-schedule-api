import { CreateOverwriteDaysUseCase } from "@domain/use-cases/create-overwrite-days.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const createOverwriteDaysFactory: CreateFactoryFunction<
	CreateOverwriteDaysUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
	const useCase = new CreateOverwriteDaysUseCase(uow);

	return { useCase, uow };
};
