import { ListAgendaConfigUseCase } from "@domain/use-cases/list-agenda-config.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listAgendaConfigFactory: CreateFactoryFunction<
	ListAgendaConfigUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const useCase = new ListAgendaConfigUseCase(uow);

	return {
		uow,
		useCase,
	};
};
