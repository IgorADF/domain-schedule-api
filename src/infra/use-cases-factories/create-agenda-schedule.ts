import { CreateAgendaScheduleUseCase } from "@domain/use-cases/create-agenda-schedule.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createAgendaScheduleFactory: CreateFactoryFunction<
	CreateAgendaScheduleUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new CreateAgendaScheduleUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
