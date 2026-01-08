import { ListAvailableSlotsUseCase } from "@domain/use-cases/list-available-slots.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { SequelizeUnitOfWork } from "@/infra/repository/sequelize/uow/sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listAvailableSlotsFactory: CreateFactoryFunction<
	ListAvailableSlotsUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();

	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);

	const useCase = new ListAvailableSlotsUseCase(
		uow,
		generateSlotsUseCase,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
