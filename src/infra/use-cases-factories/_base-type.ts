import type { ILogService } from "@/domain/services/log.interface.js";
import type { SequelizeUnitOfWork } from "@/infra/repository/uow/sequelize-unit-of-work.js";

export type CreateFactoryFunction<T> = (logService?: ILogService) => {
	useCase: T;
	uow: SequelizeUnitOfWork;
};
