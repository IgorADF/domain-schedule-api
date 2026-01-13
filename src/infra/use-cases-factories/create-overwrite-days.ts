import { CreateOverwriteDaysUseCase } from "@domain/use-cases/create-overwrite-days.js";
import { SequelizeUnitOfWork } from "@/infra/repository/_uow.js";

export function createOverwriteDaysFactory() {
	const uow = SequelizeUnitOfWork.create();
	const useCase = new CreateOverwriteDaysUseCase(uow);

	return { useCase, uow };
}
