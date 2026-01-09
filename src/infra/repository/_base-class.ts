import type { Transaction } from "sequelize";
import type { Sequelize } from "sequelize-typescript";

export class ClassRepository {
	constructor(
		protected readonly transaction: Transaction | null,
		protected readonly sequelizeConnection: Sequelize,
	) {}
}
