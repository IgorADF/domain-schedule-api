import type { CreateFactoryFunction } from "@core/@types/create-factory.js";
import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";

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
