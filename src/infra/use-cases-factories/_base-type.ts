import type { ILogService } from "@/domain/services/log.interface.js";
import type { MyPrismaClient } from "../database/types.js";
import type { PrismaUnitOfWork } from "../repositories/_uow.js";

export type CreateFactoryFunction<T> = (
	dbClient: MyPrismaClient,
	logService?: ILogService,
) => {
	useCase: T;
	uow: PrismaUnitOfWork;
};
