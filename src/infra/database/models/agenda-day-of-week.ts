import type { InferAttributes, InferCreationAttributes } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	HasMany,
	Model,
	Table,
} from "sequelize-typescript";
import AgendaConfigsModel from "./agenda-configs.js";
import AgendaPeriodsModel from "./agenda-periods.js";

export type AgendaDayOfWeekModelType = InferAttributes<AgendaDayOfWeekModel>;
export type AgendaDayOfWeekModelCreationType =
	InferCreationAttributes<AgendaDayOfWeekModel>;

@Table({ tableName: "AgendaDayOfWeek", timestamps: false })
class AgendaDayOfWeekModel extends Model<
	AgendaDayOfWeekModelType,
	AgendaDayOfWeekModelCreationType
> {
	@ForeignKey(() => AgendaConfigsModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaConfigId!: string;

	@Column({ allowNull: false, type: DataType.INTEGER })
	dayOfWeek!: number;

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	cancelAllDay!: boolean;

	declare createdAt: Date;
	declare updatedAt: Date;

	/* Associations */

	@BelongsTo(() => AgendaConfigsModel)
	agendaConfig?: AgendaConfigsModel;

	@HasMany(() => AgendaPeriodsModel)
	periods?: AgendaPeriodsModel[];
}

export default AgendaDayOfWeekModel;
