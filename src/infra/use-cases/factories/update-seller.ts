import { UpdateSellerUseCase } from "@domain/use-cases/update-seller.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const updateSellerFactory: CreateFactoryFunction<
	UpdateSellerUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const useCase = new UpdateSellerUseCase(uow);

	return {
		uow,
		useCase,
	};
};
