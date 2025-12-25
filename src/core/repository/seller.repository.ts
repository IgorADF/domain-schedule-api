import type {
	SellerType,
	SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import type { Transaction as SequelizeTransaction } from "sequelize";
import * as SellerMapper from "../database/entities-mappers/seller.js";
import { SellerModel } from "../database/models/seller.js";

export class SellerRepository implements ISellerRepository {
	private transaction: SequelizeTransaction;

	constructor(_transaction: SequelizeTransaction) {
		this.transaction = _transaction;
	}

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

		await seller.update(data, { transaction: this.transaction });
		return SellerMapper.toEntity(seller);
	}
}
