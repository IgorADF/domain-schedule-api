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

export type AgendaEventModelType = InferAttributes<AgendaEventModel>;
export type AgendaEventModelCreationType =
	InferCreationAttributes<AgendaEventModel>;

@Table({ tableName: "AgendaEvents" })
class AgendaEventModel extends Model<
	AgendaEventModelType,
	AgendaEventModelCreationType
> {
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@ForeignKey(() => AgendaConfigsModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaConfigId!: string;

	@Column({
		allowNull: false,
		type: DataType.ENUM(
			"new_schedule",
			"cancel_by_client",
			"cancel_by_user",
			"reschedule_by_user",
		),
	})
	type!: string;

	@Column({ allowNull: false, type: DataType.STRING(500) })
	description!: string;

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;

	/* Associations */

	@BelongsTo(() => AgendaConfigsModel)
	agendaConfig?: AgendaConfigsModel;
}

export default AgendaEventModel;
