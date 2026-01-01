import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";
import { createPasswordService } from "@/infra/services/factories/password.js";

export const createSellerFactory: CreateFactoryFunction<
	CreateSellerUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const { service } = createPasswordService();
	const useCase = new CreateSellerUseCase(uow, service);

	return {
		uow,
		useCase,
	};
};
