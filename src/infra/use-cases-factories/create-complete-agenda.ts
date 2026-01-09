import { CreateCompleteAgendaUseCase } from "@domain/use-cases/create-complete-agenda.js";
import { CreateAgendaConfigUseCase } from "@/domain/use-cases/create-agenda-config.js";
import { CreateAgendaDayOfWeekUseCase } from "@/domain/use-cases/create-agenda-day-of-week.js";
import { CreateAgendaPeriodsUseCase } from "@/domain/use-cases/create-agenda-periods.js";
import { GetAgendaConfigBySellerOrThrowUseCase } from "@/domain/use-cases/get-agenda-config-by-seller-or-throw.js";
import { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createCompleteAgendaFactory: CreateFactoryFunction<
	CreateCompleteAgendaUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();

	const createAgendaConfigUseCase = new CreateAgendaConfigUseCase(uow);
	const createAgendaDayOfWeekUseCase = new CreateAgendaDayOfWeekUseCase(uow);
	const createAgendaPeriodsUseCase = new CreateAgendaPeriodsUseCase(uow);
	const getAgendaConfigBySellerOrThrowUseCase =
		new GetAgendaConfigBySellerOrThrowUseCase(uow);

	const useCase = new CreateCompleteAgendaUseCase(
		uow,
		createAgendaConfigUseCase,
		createAgendaDayOfWeekUseCase,
		createAgendaPeriodsUseCase,
		getAgendaConfigBySellerOrThrowUseCase,
	);

	return {
		uow,
		useCase,
	};
};
