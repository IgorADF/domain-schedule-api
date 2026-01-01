import { AuthSellerUseCase } from "@domain/use-cases/auth-seller.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import { createPasswordService } from "@/infra/services/factories/password.js";
import type { CreateFactoryFunction } from "./_default.js";

export const authSellerFactory: CreateFactoryFunction<AuthSellerUseCase> = (
	logService,
) => {
	const { uow } = createSequelizeUOW();
	const passwordService = createPasswordService().service;
	const useCase = new AuthSellerUseCase(uow, passwordService, logService);

	return {
		uow,
		useCase,
	};
};
