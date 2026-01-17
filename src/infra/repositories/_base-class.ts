import type { MyPrismaClient } from "../database/types.js";

export class ClassRepository {
	constructor(protected readonly prismaClient: MyPrismaClient) {}
}
