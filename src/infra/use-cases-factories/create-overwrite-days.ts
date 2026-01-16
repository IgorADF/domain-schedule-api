import { CreateOverwriteDaysUseCase } from "@domain/use-cases/create-overwrite-days.js";
import { DrizzleUnitOfWork } from "@/infra/repository/_uow.js";

export function createOverwriteDaysFactory() {
	const uow = DrizzleUnitOfWork.create();
	const useCase = new CreateOverwriteDaysUseCase(uow);

	return { useCase, uow };
}
