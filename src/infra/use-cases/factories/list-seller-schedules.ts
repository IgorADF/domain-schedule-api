import { ListSellerSchedulesUseCase } from "@domain/use-cases/list-seller-schedules.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listSellerSchedulesFactory: CreateFactoryFunction<
	ListSellerSchedulesUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const useCase = new ListSellerSchedulesUseCase(uow);

	return {
		uow,
		useCase,
	};
};
