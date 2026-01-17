import { CreateAgendaScheduleUseCase } from "@domain/use-cases/create-agenda-schedule.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createAgendaScheduleFactory: CreateFactoryFunction<
	CreateAgendaScheduleUseCase
> = (dbClient) => {
	const uow = PrismaUnitOfWork.create(dbClient);
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new CreateAgendaScheduleUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
