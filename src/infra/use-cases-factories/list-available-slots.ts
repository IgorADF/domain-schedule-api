import { ListAvailableSlotsUseCase } from "@domain/use-cases/list-available-slots.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import type { CreateFactoryFunction } from "./_base-type.js";
import { createUowFactory } from "./_repository-uow.js";

export const listAvailableSlotsFactory: CreateFactoryFunction<
	ListAvailableSlotsUseCase
> = (dbClient) => {
	const { uow } = createUowFactory(dbClient);

	const generateSlotsUseCase = new GenerateSlotsUseCase();

	const useCase = new ListAvailableSlotsUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
