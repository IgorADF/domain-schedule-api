import type { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";

export type AgendaScheduleModelType = InferAttributes<AgendaScheduleModel>;
export type AgendaScheduleModelCreationType =
	InferCreationAttributes<AgendaScheduleModel>;

@Table({ tableName: "AgendaSchedules", timestamps: true })
class AgendaScheduleModel extends Model<
	AgendaScheduleModelType,
	AgendaScheduleModelCreationType
> {
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@Column({ allowNull: false, type: DataType.STRING(100) })
	contactName!: string;

	@Column({ allowNull: false, type: DataType.STRING(20) })
	contactPhoneNumber!: string;

	@Column({ allowNull: false, type: DataType.DATEONLY })
	day!: string;

	@Column({ allowNull: false, type: DataType.TIME })
	startTime!: string;

	@Column({ allowNull: false, type: DataType.TIME })
	endTime!: string;

	declare createdAt: Date;
	declare updatedAt: Date;
}

export default AgendaScheduleModel;
