import type { Transaction } from "sequelize";

export class ClassRepository {
	constructor(protected readonly transaction: Transaction | null) {}
}
