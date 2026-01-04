import { CreateOverwriteDaysUseCase } from "@domain/use-cases/create-overwrite-days.js";
import { createSequelizeUOW } from "@/infra/repository/uow/create-sequelize-unit-of-work.js";

export function createOverwriteDaysFactory() {
	const { uow } = createSequelizeUOW();
	const useCase = new CreateOverwriteDaysUseCase(uow);

	return { useCase, uow };
}
