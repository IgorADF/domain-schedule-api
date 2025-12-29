import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import type { CreateFactoryFunction } from "./_default.js";

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
