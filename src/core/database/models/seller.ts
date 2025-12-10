import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Table, Column, Model, HasMany, DataType } from "sequelize-typescript";

export type SellerModelType = InferAttributes<SellerModel>;
export type SellerModelCreationType = InferCreationAttributes<SellerModel>;

@Table({ tableName: "Sellers" })
export class SellerModel extends Model<
  SellerModelType,
  SellerModelCreationType
> {
  @Column(DataType.STRING)
  email!: string;

  @Column(DataType.STRING)
  password!: string;
}
