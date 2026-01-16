import type {
	SellerType,
	SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import { eq } from "drizzle-orm";
import * as SellerMapper from "@/infra/entities-mappers/seller.js";
import { sellers } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class SellerRepository
	extends ClassRepository
	implements ISellerRepository
{
	async create(data: SellerWithPasswordSchemaType) {
		const modelInstance = SellerMapper.toModel(data);
		const sup = await this.connection
			.insert(sellers)
			.values(modelInstance)
			.returning();

		return SellerMapper.toEntity(sup[0]);
	}

	async getSellerWithPassword(email: string) {
		const sup = await this.connection.query.sellers.findFirst({
			where: { email },
		});
		return sup ? SellerMapper.toEntityWithPassword(sup) : null;
	}

	async getSellerByEmail(email: string) {
		const sup = await this.connection.query.sellers.findFirst({
			where: { email },
		});
		return sup ? SellerMapper.toEntity(sup) : null;
	}

	async getSellerById(id: string) {
		const sup = await this.connection.query.sellers.findFirst({
			where: { id },
		});
		return sup ? SellerMapper.toEntity(sup) : null;
	}

	async updateSeller(id: string, data: Partial<SellerType>) {
		const modelData = SellerMapper.toPartialModel(data);
		await this.connection
			.update(sellers)
			.set(modelData)
			.where(eq(sellers.id, id));
	}
}
