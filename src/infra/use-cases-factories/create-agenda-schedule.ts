import { CreateAgendaScheduleUseCase } from "@domain/use-cases/create-agenda-schedule.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const createAgendaScheduleFactory: CreateFactoryFunction<
	CreateAgendaScheduleUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new CreateAgendaScheduleUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
