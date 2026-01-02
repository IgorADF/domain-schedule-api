import type { InferAttributes, InferCreationAttributes } from "sequelize";
import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import AgendaDayOfWeekModel from "./agenda-day-of-week.js";

export type AgendaPeriodsModelType = InferAttributes<AgendaPeriodsModel>;
export type AgendaPeriodsModelCreationType =
	InferCreationAttributes<AgendaPeriodsModel>;

@Table({ tableName: "AgendaPeriods", timestamps: false })
class AgendaPeriodsModel extends Model<
	AgendaPeriodsModelType,
	AgendaPeriodsModelCreationType
> {
	@ForeignKey(() => AgendaDayOfWeekModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaDayOfWeekId!: string;

	@Column({ allowNull: false, type: DataType.TIME })
	startTime!: Date;

	@Column({ allowNull: false, type: DataType.TIME })
	endTime!: Date;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	minutesOfService!: number;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	minutesOfInterval?: number;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	order!: number;

	@Column({ allowNull: false, type: DataType.DATE })
	creationDate!: Date;

	@Column({ allowNull: false, type: DataType.DATE })
	updateDate!: Date;

	/* Associations */

	@BelongsTo(() => AgendaDayOfWeekModel)
	agendaDayOfWeek?: AgendaDayOfWeekModel;
}
export default AgendaPeriodsModel;
