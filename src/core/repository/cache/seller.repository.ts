import type {
	SellerType,
	SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import { ClassCacheRepository } from "@/core/repository/cache/_default.js";

export class CachedSellerRepository
	extends ClassCacheRepository<ISellerRepository>
	implements ISellerRepository
{
	async createSeller(data: SellerWithPasswordSchemaType) {
		return await this.repository.createSeller(data);
	}

	async getSellerWithPassword(email: string) {
		return await this.repository.getSellerWithPassword(email);
	}

	async getSellerByEmail(email: string) {
		const cachedEntity = await this.cache.get<SellerType>(`seller:${email}`);

		if (cachedEntity) {
			return cachedEntity;
		}

		const entity = await this.repository.getSellerByEmail(email);

		await this.cache.set(`seller:${email}`, entity);

		return entity;
	}

	async getSellerById(id: string) {
		return await this.repository.getSellerById(id);
	}

	async updateSeller(id: string, data: Partial<SellerType>) {
		return await this.repository.updateSeller(id, data);
	}
}
