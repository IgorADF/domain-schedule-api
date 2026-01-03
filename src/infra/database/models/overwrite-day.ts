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

export type OverwriteDayModelType = InferAttributes<OverwriteDayModel>;
export type OverwriteDayModelCreationType =
	InferCreationAttributes<OverwriteDayModel>;

@Table({ tableName: "OverwriteDay", timestamps: false })
class OverwriteDayModel extends Model<
	OverwriteDayModelType,
	OverwriteDayModelCreationType
> {
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@ForeignKey(() => AgendaConfigsModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaId!: string;

	@Column({ allowNull: false, type: DataType.DATEONLY })
	day!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	cancelAllDay!: boolean;

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;

	/* Associations */

	@BelongsTo(() => AgendaConfigsModel)
	agenda?: AgendaConfigsModel;
}

export default OverwriteDayModel;
