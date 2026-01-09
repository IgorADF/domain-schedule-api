import { ListAgendaConfigUseCase } from "@domain/use-cases/list-agenda-config.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listAgendaConfigFactory: CreateFactoryFunction<
	ListAgendaConfigUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();
	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);
	const useCase = new ListAgendaConfigUseCase(
		uow,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
