import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { AgendaDayOfWeekModel } from "./agenda-day-of-week.js";
import { OverwriteDayModel } from "./overwrite-day.js";

export type AgendaPeriodsModelType = InferAttributes<AgendaPeriodsModel>;
export type AgendaPeriodsModelCreationType =
  InferCreationAttributes<AgendaPeriodsModel>;

@Table({ tableName: "AgendaPeriods", timestamps: false })
export class AgendaPeriodsModel extends Model<
  AgendaPeriodsModelType,
  AgendaPeriodsModelCreationType
> {
  @ForeignKey(() => AgendaDayOfWeekModel)
  @Column({ allowNull: false, type: DataType.UUID })
  agendaDayOfWeekId!: string;

  @ForeignKey(() => OverwriteDayModel)
  @Column({ allowNull: false, type: DataType.UUID })
  overwriteId!: string;

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
  minutesOfInterval!: number;

  @Column({
    allowNull: false,
    type: DataType.INTEGER,
  })
  order!: number;

  declare createdAt: Date;
  declare updatedAt: Date;

  /* Associations */

  @BelongsTo(() => AgendaDayOfWeekModel)
  agendaDayOfWeek?: AgendaDayOfWeekModel;

  @BelongsTo(() => OverwriteDayModel)
  overwriteDay?: OverwriteDayModel;
}
