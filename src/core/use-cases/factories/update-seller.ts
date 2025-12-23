import { UpdateSellerUseCase } from "../../../domain/use-cases/update-seller.js";
import type { CreateFactoryFunction } from "../../@types/create-factory.js";
import { SequelizeUnitOfWork } from "../../repository/uow/sequelize-unit-of-work.js";

export const updateSellerFactory: CreateFactoryFunction<
  UpdateSellerUseCase
> = () => {
  const uow = new SequelizeUnitOfWork();
  const useCase = new UpdateSellerUseCase(uow);

  return {
    uow,
    useCase,
  };
};
