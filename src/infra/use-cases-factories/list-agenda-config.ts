import { ListAgendaConfigUseCase } from "@domain/use-cases/list-agenda-config.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listAgendaConfigFactory: CreateFactoryFunction<
	ListAgendaConfigUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();
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
