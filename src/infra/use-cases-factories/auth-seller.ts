import { AuthSellerUseCase } from "@domain/use-cases/auth-seller.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const authSellerFactory: CreateFactoryFunction<AuthSellerUseCase> = (
	dbClient,
	logService,
) => {
	const uow = PrismaUnitOfWork.create(dbClient);
	const hashPasswordService = HashPasswordService.create();
	const useCase = new AuthSellerUseCase(uow, hashPasswordService, logService);

	return {
		uow,
		useCase,
	};
};
