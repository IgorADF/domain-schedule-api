import type { MyPrismaClient } from "../types.js";

export class ClassRepository {
	constructor(protected readonly prismaClient: MyPrismaClient) {}
}
