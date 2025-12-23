import { CreateSellerUseCase } from "../../../domain/use-cases/create-seller.js";
import type { CreateFactoryFunction } from "../../@types/create-factory.js";
import { SequelizeUnitOfWork } from "../../repository/uow/sequelize-unit-of-work.js";

export const createSellerFactory: CreateFactoryFunction<
  CreateSellerUseCase
> = () => {
  const uow = new SequelizeUnitOfWork();
  const useCase = new CreateSellerUseCase(uow);

  return {
    uow,
    useCase,
  };
};
