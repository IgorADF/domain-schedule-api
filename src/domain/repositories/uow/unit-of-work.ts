import { ISellerRepository } from "../seller.interface.js";

export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;

  get sellerRepository(): ISellerRepository;
}
