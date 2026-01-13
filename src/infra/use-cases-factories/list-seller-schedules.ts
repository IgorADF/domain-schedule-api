import { ListSellerSchedulesUseCase } from "@domain/use-cases/list-seller-schedules.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { SequelizeUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listSellerSchedulesFactory: CreateFactoryFunction<
	ListSellerSchedulesUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();

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
