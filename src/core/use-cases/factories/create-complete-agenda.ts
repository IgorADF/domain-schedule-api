import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import { CreateCompleteAgendaUseCase } from "@domain/use-cases/create-complete-agenda.js";
import type { CreateFactoryFunction } from "./_default.js";

export const createCompleteAgendaFactory: CreateFactoryFunction<
	CreateCompleteAgendaUseCase
> = () => {
	const uow = new SequelizeUnitOfWork();
	const useCase = new CreateCompleteAgendaUseCase(uow);

	return {
		uow,
		useCase,
	};
};
