import type { ILogService } from "@/domain/services/log.interface.js";
import type { SequelizeUnitOfWork } from "@/infra/repository/_uow.js";

export type CreateFactoryFunction<T> = (logService?: ILogService) => {
	useCase: T;
	uow: SequelizeUnitOfWork;
};
