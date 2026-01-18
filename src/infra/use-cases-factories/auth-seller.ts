import { AuthSellerUseCase } from "@domain/use-cases/auth-seller.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const authSellerFactory: CreateFactoryFunction<AuthSellerUseCase> = (
	dbClient,
	logService,
) => {
	const { uow } = createUowFactory(dbClient);
	const hashPasswordService = HashPasswordService.create();
	const useCase = new AuthSellerUseCase(uow, hashPasswordService, logService);

	return {
		uow,
		useCase,
	};
};
