import type { SellerType, SellerWithPasswordType } from "../entities/seller.js";

export interface ISellerRepository {
	getSellerWithPassword(email: string): Promise<SellerWithPasswordType | null>;
	getSellerByEmail(email: string): Promise<SellerType | null>;
	getSellerById(id: string): Promise<SellerType | null>;
	create(_: SellerType): Promise<SellerType>;
	updateSeller(id: string, data: Partial<SellerType>): Promise<void>;
}
