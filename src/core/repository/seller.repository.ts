import { Transaction as SequelizeTransaction } from "sequelize";
import { ISellerRepository } from "../../domain/repositories/seller.interface.js";
import { SellerMapper } from "../database/entities-mappers/seller.js";
import { SellerModel } from "../database/models/seller.js";
import { SellerWithPasswordSchemaType } from "../../domain/entities/seller.js";

export class SellerRepository implements ISellerRepository {
  private transaction: SequelizeTransaction;

  constructor(_transaction: SequelizeTransaction) {
    this.transaction = _transaction;
  }

  async createSeller(data: SellerWithPasswordSchemaType) {
    const modelInstance = SellerMapper.toModel(data);
    const sup = await SellerModel.create(modelInstance);
    return SellerMapper.toEntity(sup);
  }

  async getSeller(email: string) {
    const sup = await SellerModel.findOne({ where: { email } });
    return sup ? SellerMapper.toEntity(sup) : null;
  }
}
