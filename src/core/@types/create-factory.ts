import type { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";

export type CreateFactoryFunction<T> = () => {
  useCase: T;
  uow: SequelizeUnitOfWork;
};
