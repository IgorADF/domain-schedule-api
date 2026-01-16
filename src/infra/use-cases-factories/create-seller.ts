import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createSellerFactory: CreateFactoryFunction<
	CreateSellerUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();
	const service = HashPasswordService.create();
	const useCase = new CreateSellerUseCase(uow, service);

	return {
		uow,
		useCase,
	};
};
