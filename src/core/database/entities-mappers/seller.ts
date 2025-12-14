import {
  SellerSchema,
  SellerType,
  SellerWithPasswordSchema,
  SellerWithPasswordSchemaType,
} from "../../../domain/entities/seller.js";
import { SellerModel } from "../models/seller.js";

export class SellerMapper {
  static toModel(sup: SellerWithPasswordSchemaType): SellerModel {
    return new SellerModel({
      id: sup.id,
      name: sup.name,
      email: sup.email,
      password: sup.password,
      createdAt: sup.createAt,
      updatedAt: sup.updatedAt,
    });
  }

  static toEntity(_sup: SellerModel): SellerType {
    const sup = _sup.toJSON();

    const map = {
      id: sup.id,
      name: sup.name,
      email: sup.email,
    };

    const entity = SellerSchema.parse(map);
    return entity;
  }

  static toEntityWithPassword(_sup: SellerModel): SellerWithPasswordSchemaType {
    const sup = _sup.toJSON();

    const map = {
      id: sup.id,
      name: sup.name,
      email: sup.email,
      password: sup.password,
    };

    const entity = SellerWithPasswordSchema.parse(map);
    return entity;
  }
}
