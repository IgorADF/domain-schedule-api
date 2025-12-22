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
import { AgendaDayOfWeekModel } from "./agenda-day-of-week.js";
import { AgendaEventModel } from "./agenda-event.js";
import { OverwriteDayModel } from "./overwrite-day.js";
import { SellerModel } from "./seller.js";

export type AgendaConfigsModelType = InferAttributes<AgendaConfigsModel>;
export type AgendaConfigsModelCreationType =
	InferCreationAttributes<AgendaConfigsModel>;

@Table({ tableName: "AgendaConfigs", timestamps: false })
export class AgendaConfigsModel extends Model<
	AgendaConfigsModelType,
	AgendaConfigsModelCreationType
> {
	@ForeignKey(() => SellerModel)
	@Column({ allowNull: false, type: DataType.UUID, unique: true })
	sellerId!: string;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	maxDaysOfAdvancedNotice!: number;

	@Column({ type: DataType.INTEGER })
	minHoursOfAdvancedNotice?: number;

	@Column({ allowNull: false, type: DataType.STRING(50) })
	timezone!: string;

	declare createdAt: Date;
	declare updatedAt: Date;

	/* Associations */

	@BelongsTo(() => SellerModel)
	seller?: SellerModel;

	@HasMany(() => AgendaDayOfWeekModel)
	daysOfWeek?: AgendaDayOfWeekModel[];

	@HasMany(() => OverwriteDayModel)
	overwriteDays?: OverwriteDayModel[];

	@HasMany(() => AgendaEventModel)
	events?: AgendaEventModel[];
}
