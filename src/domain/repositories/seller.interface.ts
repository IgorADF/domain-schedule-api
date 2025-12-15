import {
  SellerType,
  SellerWithPasswordSchemaType,
} from "../entities/seller.js";

export interface ISellerRepository {
  getSellerWithPassword(
    email: string
  ): Promise<SellerWithPasswordSchemaType | null>;
  getSellerByEmail(email: string): Promise<SellerType | null>;
  getSellerById(id: string): Promise<SellerType | null>;
  createSeller(_: SellerType): Promise<SellerType>;
  updateSeller(id: string, data: Partial<SellerType>): Promise<SellerType>;
}
