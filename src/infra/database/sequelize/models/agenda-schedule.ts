import type { InferAttributes, InferCreationAttributes } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import AgendaConfigsModel from "./agenda-configs.js";

export type AgendaScheduleModelType = InferAttributes<AgendaScheduleModel>;
export type AgendaScheduleModelCreationType =
	InferCreationAttributes<AgendaScheduleModel>;

@Table({ tableName: "AgendaSchedules", timestamps: false })
class AgendaScheduleModel extends Model<
	AgendaScheduleModelType,
	AgendaScheduleModelCreationType
> {
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@ForeignKey(() => AgendaConfigsModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaConfigId!: string;

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

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;

	/* Associations */

	@BelongsTo(() => AgendaConfigsModel)
	agendaConfig?: AgendaConfigsModel;
}

export default AgendaScheduleModel;
