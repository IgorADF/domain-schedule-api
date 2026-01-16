import { CreateAgendaEventUseCase } from "@domain/use-cases/create-agenda-event.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createAgendaEventFactory: CreateFactoryFunction<
	CreateAgendaEventUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();
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
