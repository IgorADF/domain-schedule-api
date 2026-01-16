import { ListSellerAgendaEventsUseCase } from "@domain/use-cases/list-seller-agenda-events.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listSellerAgendaEventsFactory: CreateFactoryFunction<
	ListSellerAgendaEventsUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();

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
