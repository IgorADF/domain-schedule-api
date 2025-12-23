import type { SequelizeUnitOfWork } from "../repository/uow/sequelize-unit-of-work.js";

export type CreateFactoryFunction<T> = () => {
  useCase: T;
  uow: SequelizeUnitOfWork;
};
