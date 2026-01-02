import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, HasOne, Model, Table } from "sequelize-typescript";
import AgendaConfigsModel from "./agenda-configs.js";

export type SellerModelType = InferAttributes<SellerModel>;
export type SellerModelCreationType = InferCreationAttributes<SellerModel>;

@Table({
	tableName: "Sellers",
	paranoid: true,
	timestamps: false,
	defaultScope: { attributes: { exclude: ["password"] } },
})
class SellerModel extends Model<SellerModelType, SellerModelCreationType> {
	@Column({ allowNull: false, type: DataType.STRING(50) })
	name!: string;

	@Column({ allowNull: false, type: DataType.STRING(50), unique: true })
	email!: string;

	@Column({ allowNull: false, type: DataType.STRING(100) })
	password!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;

	@Column({ type: DataType.DATE })
	deleteDate!: Date | null;

	/* Associations */

	@HasOne(() => AgendaConfigsModel)
	agendaConfig?: AgendaConfigsModel;
}

export default SellerModel;
