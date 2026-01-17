import { ListSellerAgendaEventsUseCase } from "@domain/use-cases/list-seller-agenda-events.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listSellerAgendaEventsFactory: CreateFactoryFunction<
	ListSellerAgendaEventsUseCase
> = (dbClient) => {
	const uow = PrismaUnitOfWork.create(dbClient);

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
