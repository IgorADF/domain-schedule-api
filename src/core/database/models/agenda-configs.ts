import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
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

  @Column({ allowNull: false, type: DataType.INTEGER })
  maxDaysOfAdvancedNotice!: number;

  @Column({ type: DataType.INTEGER })
  minHoursOfAdvancedNotice!: number;

  @Column({ allowNull: false, type: DataType.STRING })
  timezone!: string;

  declare createdAt: Date;
  declare updatedAt: Date;

  /* Associations */

  @BelongsTo(() => SellerModel)
  seller!: SellerModel;
}
