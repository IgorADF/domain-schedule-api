import { AuthSellerUseCase } from "@domain/use-cases/auth-seller.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const authSellerFactory: CreateFactoryFunction<AuthSellerUseCase> = (
	logService,
) => {
	const uow = DrizzleUnitOfWork.create();
	const hashPasswordService = HashPasswordService.create();
	const useCase = new AuthSellerUseCase(uow, hashPasswordService, logService);

	return {
		uow,
		useCase,
	};
};
