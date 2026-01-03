import { ListAvailableSlotsUseCase } from "@domain/use-cases/list-available-slots.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";
import type { CreateFactoryFunction } from "./_default.js";

export const listAvailableSlotsFactory: CreateFactoryFunction<
	ListAvailableSlotsUseCase
> = () => {
	const { uow } = createSequelizeUOW();
	const generateSlotsUseCase = new GenerateSlotsUseCase();
	const useCase = new ListAvailableSlotsUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
