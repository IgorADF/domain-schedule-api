import { CreateCompleteAgendaUseCase } from "@domain/use-cases/create-complete-agenda.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const createCompleteAgendaFactory: CreateFactoryFunction<
	CreateCompleteAgendaUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const useCase = new CreateCompleteAgendaUseCase(uow);

	return {
		uow,
		useCase,
	};
};
