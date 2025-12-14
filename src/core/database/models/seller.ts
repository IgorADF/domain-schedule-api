import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  Table,
  Column,
  Model,
  HasMany,
  DataType,
  HasOne,
} from "sequelize-typescript";
import { AgendaConfigsModel } from "./agenda-configs.js";

export type SellerModelType = InferAttributes<SellerModel>;
export type SellerModelCreationType = InferCreationAttributes<SellerModel>;

@Table({ tableName: "Sellers", paranoid: true, timestamps: false })
export class SellerModel extends Model<
  SellerModelType,
  SellerModelCreationType
> {
  @Column({ allowNull: false, type: DataType.STRING })
  name!: string;

  @Column({ allowNull: false, type: DataType.STRING, unique: true })
  email!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  password!: string;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  /* Associations */

  @HasOne(() => AgendaConfigsModel)
  agendaConfig?: AgendaConfigsModel;
}
