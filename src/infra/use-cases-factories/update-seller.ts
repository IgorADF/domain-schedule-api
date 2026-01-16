import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const updateSellerFactory: CreateFactoryFunction<
	UpdateSellerUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
