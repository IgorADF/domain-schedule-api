import type {
	SellerType,
	SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import * as SellerMapper from "@/infra/entities-mappers/seller.js";
import { ClassRepository } from "./_base-class.js";

export class SellerRepository
	extends ClassRepository
	implements ISellerRepository
{
	async create(data: SellerWithPasswordSchemaType) {
		const modelInstance = SellerMapper.toModel(data);

		const created = await this.prismaClient.seller.create({
			data: modelInstance,
		});

		return SellerMapper.toEntity(created);
	}

	async getSellerWithPassword(email: string) {
		const seller = await this.prismaClient.seller.findFirst({
			where: { email },
		});
		return seller ? SellerMapper.toEntityWithPassword(seller) : null;
	}

	async getSellerByEmail(email: string) {
		const seller = await this.prismaClient.seller.findFirst({
			where: { email },
		});
		return seller ? SellerMapper.toEntity(seller) : null;
	}

	async getSellerById(id: string) {
		const seller = await this.prismaClient.seller.findFirst({
			where: { id },
		});
		return seller ? SellerMapper.toEntity(seller) : null;
	}

	async updateSeller(id: string, data: Partial<SellerType>) {
		const modelData = SellerMapper.toPartialModel(data);
		await this.prismaClient.seller.update({
			where: { id },
			data: modelData,
		});
	}
}
