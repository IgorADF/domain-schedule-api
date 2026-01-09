import { CreateSellerUseCase } from "@domain/use-cases/create-seller.js";
import { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";
import { HashPasswordService } from "@/infra/services/password.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createSellerFactory: CreateFactoryFunction<
	CreateSellerUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();
	const service = HashPasswordService.create();
	const useCase = new CreateSellerUseCase(uow, service);

	return {
		uow,
		useCase,
	};
};
