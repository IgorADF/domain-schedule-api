import { DeleteAgendaScheduleUseCase } from "@domain/use-cases/delete-agenda-schedule.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const deleteAgendaScheduleFactory: CreateFactoryFunction<
	DeleteAgendaScheduleUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
	const useCase = new DeleteAgendaScheduleUseCase(uow);

	return {
		uow,
		useCase,
	};
};
