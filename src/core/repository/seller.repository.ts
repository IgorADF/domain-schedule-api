import type {
	SellerType,
	SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import { SellerModel } from "../database/models/seller.js";
import * as SellerMapper from "../entities/mappers/seller.js";
import { ClassRepository } from "./_default.js";

export class SellerRepository
	extends ClassRepository
	implements ISellerRepository
{
	async createSeller(data: SellerWithPasswordSchemaType) {
		const modelInstance = SellerMapper.toModel(data);
		const sup = await SellerModel.create(modelInstance);
		return SellerMapper.toEntity(sup);
	}

	async getSellerWithPassword(email: string) {
		const sup = await SellerModel.findOne({
			where: { email },
			attributes: { include: ["password"] },
		});
		return sup ? SellerMapper.toEntityWithPassword(sup) : null;
	}

	async getSellerByEmail(email: string) {
		const sup = await SellerModel.findOne({ where: { email } });
		return sup ? SellerMapper.toEntity(sup) : null;
	}

	async getSellerById(id: string) {
		const sup = await SellerModel.findByPk(id);
		return sup ? SellerMapper.toEntity(sup) : null;
	}

	async updateSeller(id: string, data: Partial<SellerType>) {
		const seller = await SellerModel.findByPk(id);
		if (!seller) {
			throw new Error("Seller not found");
		}

		const modelData = SellerMapper.toPartialModel(data);

		await seller.update(modelData, { transaction: this.transaction });
		return SellerMapper.toEntity(seller);
	}
}
