import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import { SequelizeUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const updateSellerFactory: CreateFactoryFunction<
	UpdateSellerUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
