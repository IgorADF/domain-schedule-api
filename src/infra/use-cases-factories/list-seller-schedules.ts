import { ListSellerSchedulesUseCase } from "@domain/use-cases/list-seller-schedules.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const listSellerSchedulesFactory: CreateFactoryFunction<
	ListSellerSchedulesUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);

	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);

	const useCase = new ListSellerSchedulesUseCase(
		uow,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
