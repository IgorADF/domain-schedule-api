import type { ILogService } from "@/domain/services/log.interface.js";
import type { PrismaUnitOfWork } from "../database/prisma/repositories/_uow.js";
import type { MyPrismaClient } from "../database/prisma/types.js";

export type CreateFactoryFunction<T> = (
	dbClient: MyPrismaClient,
	logService?: ILogService,
) => {
	useCase: T;
	uow: PrismaUnitOfWork;
};
