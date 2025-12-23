import type { CreateFactoryFunction } from "@core/@types/create-factory.js";
import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";

export const createSellerFactory: CreateFactoryFunction<
	CreateSellerUseCase
> = () => {
	const uow = new SequelizeUnitOfWork();
	const useCase = new CreateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
