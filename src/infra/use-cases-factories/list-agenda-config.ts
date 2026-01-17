import { ListAgendaConfigUseCase } from "@domain/use-cases/list-agenda-config.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listAgendaConfigFactory: CreateFactoryFunction<
	ListAgendaConfigUseCase
> = (dbClient) => {
	const uow = PrismaUnitOfWork.create(dbClient);
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
