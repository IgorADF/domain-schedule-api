import type { InferAttributes, InferCreationAttributes } from "sequelize";
import {
	Column,
	DataType,
	HasMany,
	HasOne,
	Model,
	Table,
} from "sequelize-typescript";
import { AgendaConfigsModel } from "./agenda-configs.js";

export type SellerModelType = InferAttributes<SellerModel>;
export type SellerModelCreationType = InferCreationAttributes<SellerModel>;

@Table({
	tableName: "Sellers",
	paranoid: true,
	timestamps: true,
	defaultScope: { attributes: { exclude: ["password"] } },
})
export class SellerModel extends Model<
	SellerModelType,
	SellerModelCreationType
> {
	@Column({ allowNull: false, type: DataType.STRING(50) })
	name!: string;

	@Column({ allowNull: false, type: DataType.STRING(50), unique: true })
	email!: string;

	@Column({ allowNull: false, type: DataType.STRING(50) })
	password!: string;

	declare createdAt: Date;
	declare updatedAt: Date;
	declare deletedAt?: Date;

	/* Associations */

	@HasOne(() => AgendaConfigsModel)
	agendaConfig?: AgendaConfigsModel;
}
