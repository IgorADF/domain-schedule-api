import { SellerType } from "../entities/seller.js";

export interface ISellerRepository {
  getSeller(email: string): Promise<SellerType | null>;
  createSeller(_: { email: string; password: string }): Promise<SellerType>;
}
