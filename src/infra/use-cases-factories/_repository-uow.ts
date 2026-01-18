import { PrismaUnitOfWork } from "../database/prisma/repositories/_uow.js";
import type { MyPrismaClient } from "../database/prisma/types.js";

export function createUowFactory(dbClient: MyPrismaClient) {
	return {
		uow: new PrismaUnitOfWork(dbClient),
	};
}
