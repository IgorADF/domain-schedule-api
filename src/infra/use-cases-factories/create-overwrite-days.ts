import { CreateOverwriteDaysUseCase } from "@domain/use-cases/create-overwrite-days.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createOverwriteDaysFactory: CreateFactoryFunction<
	CreateOverwriteDaysUseCase
> = (dbClient) => {
	const uow = PrismaUnitOfWork.create(dbClient);
	const useCase = new CreateOverwriteDaysUseCase(uow);

	return { useCase, uow };
};
