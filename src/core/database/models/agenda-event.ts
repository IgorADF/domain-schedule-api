import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { AgendaConfigsModel } from "./agenda-configs.js";

export type AgendaEventModelType = InferAttributes<AgendaEventModel>;
export type AgendaEventModelCreationType =
  InferCreationAttributes<AgendaEventModel>;

@Table({ tableName: "AgendaEvents", timestamps: false })
export class AgendaEventModel extends Model<
  AgendaEventModelType,
  AgendaEventModelCreationType
> {
  @Column({ allowNull: false, type: DataType.UUID, primaryKey: true })
  id!: string;

  @ForeignKey(() => AgendaConfigsModel)
  @Column({ allowNull: false, type: DataType.UUID })
  agendaConfigId!: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM(
      "new_schedule",
      "cancel_by_client",
      "cancel_by_user",
      "reschedule_by_user"
    ),
  })
  type!: string;

  @Column({ allowNull: false, type: DataType.STRING(500) })
  description!: string;

  declare createdAt: Date;
  declare updatedAt: Date;

  /* Associations */

  @BelongsTo(() => AgendaConfigsModel)
  agendaConfig?: AgendaConfigsModel;
}
