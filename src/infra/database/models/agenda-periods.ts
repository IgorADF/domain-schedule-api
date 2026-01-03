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
	@Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
	declare id: string;

	@ForeignKey(() => AgendaDayOfWeekModel)
	@Column({ allowNull: false, type: DataType.UUID })
	agendaDayOfWeekId!: string;

	@Column({ allowNull: false, type: DataType.TIME })
	startTime!: string;

	@Column({ allowNull: false, type: DataType.TIME })
	endTime!: string;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	minutesOfService!: number;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	minutesOfInterval!: number | null;

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
