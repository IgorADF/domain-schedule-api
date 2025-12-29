import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import type { CreateFactoryFunction } from "./_default.js";

export const updateSellerFactory: CreateFactoryFunction<
	UpdateSellerUseCase
> = () => {
	const uow = new SequelizeUnitOfWork();
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
