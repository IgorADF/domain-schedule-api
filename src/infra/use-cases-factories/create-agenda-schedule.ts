import { CreateAgendaScheduleUseCase } from "@domain/use-cases/create-agenda-schedule.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const createAgendaScheduleFactory: CreateFactoryFunction<
	CreateAgendaScheduleUseCase
> = () => {
	const uow = SequelizeUnitOfWork.create();
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new CreateAgendaScheduleUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
