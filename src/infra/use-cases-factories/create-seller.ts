import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createSellerFactory: CreateFactoryFunction<CreateSellerUseCase> = (
	dbClient,
) => {
	const uow = PrismaUnitOfWork.create(dbClient);
	const service = HashPasswordService.create();
	const useCase = new CreateSellerUseCase(uow, service);

	return {
		uow,
		useCase,
	};
};
