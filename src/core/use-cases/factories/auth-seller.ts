import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { AuthSellerUseCase } from "@domain/use-cases/auth-seller.js";
import type { CreateFactoryFunction } from "./_default.js";

export const authSellerFactory: CreateFactoryFunction<AuthSellerUseCase> = (
	logService,
) => {
	const uow = new SequelizeUnitOfWork();
	const useCase = new AuthSellerUseCase(uow, logService);

	return {
		uow,
		useCase,
	};
};
