import { ListAvailableSlotsUseCase } from "@domain/use-cases/list-available-slots.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { PrismaUnitOfWork } from "@/infra/repositories/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listAvailableSlotsFactory: CreateFactoryFunction<
	ListAvailableSlotsUseCase
> = (dbClient) => {
	const uow = PrismaUnitOfWork.create(dbClient);

	const generateSlotsUseCase = new GenerateSlotsUseCase();

	const useCase = new ListAvailableSlotsUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
