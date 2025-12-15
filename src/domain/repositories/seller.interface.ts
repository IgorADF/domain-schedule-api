import { SellerType } from "../entities/seller.js";

export interface ISellerRepository {
  getSeller(email: string): Promise<SellerType | null>;
  getSellerById(id: string): Promise<SellerType | null>;
  createSeller(_: SellerType): Promise<SellerType>;
  updateSeller(id: string, data: Partial<SellerType>): Promise<SellerType>;
}
