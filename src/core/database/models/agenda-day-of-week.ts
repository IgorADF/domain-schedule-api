import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from "sequelize-typescript";
import { AgendaConfigsModel } from "./agenda-configs.js";
import { AgendaPeriodsModel } from "./agenda-periods.js";

export type AgendaDayOfWeekModelType = InferAttributes<AgendaDayOfWeekModel>;
export type AgendaDayOfWeekModelCreationType =
  InferCreationAttributes<AgendaDayOfWeekModel>;

@Table({ tableName: "AgendaDayOfWeek", timestamps: false })
export class AgendaDayOfWeekModel extends Model<
  AgendaDayOfWeekModelType,
  AgendaDayOfWeekModelCreationType
> {
  @ForeignKey(() => AgendaConfigsModel)
  @Column({ allowNull: false, type: DataType.UUID })
  agendaConfigId!: string;

  @Column({ allowNull: false, type: DataType.INTEGER })
  dayOfWeek!: number;

  declare createdAt: Date;
  declare updatedAt: Date;

  /* Associations */

  @BelongsTo(() => AgendaConfigsModel)
  agendaConfig?: AgendaConfigsModel;

  @HasMany(() => AgendaPeriodsModel)
  periods?: AgendaPeriodsModel[];
}
