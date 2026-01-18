import { ListAgendaConfigUseCase } from "@domain/use-cases/list-agenda-config.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const listAgendaConfigFactory: CreateFactoryFunction<
	ListAgendaConfigUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
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
