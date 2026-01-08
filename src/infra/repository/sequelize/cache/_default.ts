import type { RedisCacheService } from "../../../cache/service.js";

export class ClassCacheRepository<T> {
	constructor(
		protected readonly repository: T,
		protected readonly cache: RedisCacheService,
	) {}
}
