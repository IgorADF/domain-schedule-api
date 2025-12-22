import type { InferAttributes, InferCreationAttributes } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import { AgendaConfigsModel } from "./agenda-configs.js";

export type OverwriteDayModelType = InferAttributes<OverwriteDayModel>;
export type OverwriteDayModelCreationType =
	InferCreationAttributes<OverwriteDayModel>;

@Table({ tableName: "OverwriteDay", timestamps: false })
export class OverwriteDayModel extends Model<
	OverwriteDayModelType,
	OverwriteDayModelCreationType
> {
	@ForeignKey(() => AgendaConfigsModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaId!: string;

	@Column({ allowNull: false, type: DataType.DATEONLY })
	day!: Date;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	cancelAllDay!: boolean;

	/* Associations */

	@BelongsTo(() => AgendaConfigsModel)
	agenda?: AgendaConfigsModel;
}
