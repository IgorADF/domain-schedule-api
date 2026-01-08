import { ListSellerAgendaEventsUseCase } from "@domain/use-cases/list-seller-agenda-events.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listSellerAgendaEventsFactory: CreateFactoryFunction<
	ListSellerAgendaEventsUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);

	const useCase = new ListSellerAgendaEventsUseCase(
		uow,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
