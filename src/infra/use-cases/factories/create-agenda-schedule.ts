import { CreateAgendaScheduleUseCase } from "@domain/use-cases/create-agenda-schedule.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const createAgendaScheduleFactory: CreateFactoryFunction<
	CreateAgendaScheduleUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new CreateAgendaScheduleUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
