import type { RedisCacheService } from "@/infra/cache/redis-service.js";

export class ClassCacheRepository<T> {
	constructor(
		protected readonly repository: T,
		protected readonly cache: RedisCacheService,
	) {}
}
