import { ISellerRepository } from "../../domain/repositories/seller.interface.js";
import { SellerMapper } from "../database/entities-mappers/seller.js";
import { SellerModel } from "../database/models/seller.js";

export class SellerRepository implements ISellerRepository {
  async createSeller({ email, password }: { email: string; password: string }) {
    const sup = await SellerModel.create({ email, password });
    return SellerMapper.toEntity(sup);
  }

  async getSeller(email: string) {
    const sup = await SellerModel.findOne({ where: { email } });
    return sup ? SellerMapper.toEntity(sup) : null;
  }
}
