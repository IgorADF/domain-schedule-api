import { ListAvailableSlotsUseCase } from "@domain/use-cases/list-available-slots.js";
import { GenerateSlotsUseCase } from "@/domain/use-cases/generate-slots.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";
import type { CreateFactoryFunction } from "./_base-type.js";

export const listAvailableSlotsFactory: CreateFactoryFunction<
	ListAvailableSlotsUseCase
> = () => {
	const uow = DrizzleUnitOfWork.create();

	const generateSlotsUseCase = new GenerateSlotsUseCase();

	const useCase = new ListAvailableSlotsUseCase(uow, generateSlotsUseCase);

	return {
		uow,
		useCase,
	};
};
