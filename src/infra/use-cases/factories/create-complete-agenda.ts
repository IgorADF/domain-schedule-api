import { CreateCompleteAgendaUseCase } from "@domain/use-cases/create-complete-agenda.js";
import { CreateAgendaConfigUseCase } from "@/domain/use-cases/create-agenda-config.js";
import { CreateAgendaDayOfWeekUseCase } from "@/domain/use-cases/create-agenda-day-of-week.js";
import { CreateAgendaPeriodsUseCase } from "@/domain/use-cases/create-agenda-periods.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const createCompleteAgendaFactory: CreateFactoryFunction<
	CreateCompleteAgendaUseCase
> = () => {
	const { uow } = createSequelizeUOW();

	const createAgendaConfigUseCase = new CreateAgendaConfigUseCase(uow);
	const createAgendaDayOfWeekUseCase = new CreateAgendaDayOfWeekUseCase(uow);
	const createAgendaPeriodsUseCase = new CreateAgendaPeriodsUseCase(uow);

	const useCase = new CreateCompleteAgendaUseCase(
		uow,
		createAgendaConfigUseCase,
		createAgendaDayOfWeekUseCase,
		createAgendaPeriodsUseCase,
	);

	return {
		uow,
		useCase,
	};
};
