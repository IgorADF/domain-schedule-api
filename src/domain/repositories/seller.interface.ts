import { Seller } from "../entities/seller.js";

export interface SellerRepository {
  getSeller(email: string): Promise<Seller | null>;
  createSeller(_: { email: string; password: string }): Promise<Seller>;
}
