import { CreateAgendaEventUseCase } from "@domain/use-cases/create-agenda-event.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const createAgendaEventFactory: CreateFactoryFunction<
	CreateAgendaEventUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);
	const useCase = new CreateAgendaEventUseCase(
		uow,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
