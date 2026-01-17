import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const updateSellerFactory: CreateFactoryFunction<UpdateSellerUseCase> = (
	dbClient,
) => {
	const uow = PrismaUnitOfWork.create(dbClient);
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
