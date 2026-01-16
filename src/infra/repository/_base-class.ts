import type { DrizzleConnection } from "../database/connection.js";

export class ClassRepository {
	constructor(protected readonly connection: DrizzleConnection) {}
}
