import { CreateCompleteAgendaUseCase } from "@domain/use-cases/create-complete-agenda.js";
import type { CreateFactoryFunction } from "@core/@types/create-factory.js";
import { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";

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
