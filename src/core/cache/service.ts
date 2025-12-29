import type { Redis } from "ioredis";
import { redisClient } from "./redis.js";

export class RedisCacheService {
	constructor(private readonly client: Redis | null) {}

	static createInstance(): RedisCacheService {
		return new RedisCacheService(redisClient);
	}

	async get<T>(key: string): Promise<T | null> {
		if (!this.client) {
			return null;
		}

		const value = await this.client.get(key);
		return value ? JSON.parse(value) : null;
	}

	async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
		if (!this.client) {
			return;
		}

		await this.client.setex(key, ttlSeconds, JSON.stringify(value));
	}

	async delete(key: string): Promise<void> {
		if (!this.client) {
			return;
		}

		await this.client.del(key);
	}

	async clear(): Promise<void> {
		if (!this.client) {
			return;
		}

		await this.client.flushdb();
	}
}
