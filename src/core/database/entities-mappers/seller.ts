import { SellerType } from "../../../domain/entities/seller.js";
import { SellerModel } from "../models/seller.js";

export class SellerMapper {
  static toModel(sup: SellerType): SellerModel {
    return new SellerModel({
      id: sup.id,
      email: sup.email,
      password: sup.password,
    });
  }

  static toEntity(_sup: SellerModel): SellerType {
    const sup = _sup.toJSON();

    return {
      id: sup.id,
      email: sup.email,
      password: sup.password,
    };
  }
}
