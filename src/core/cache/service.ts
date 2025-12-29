import type { Redis } from "ioredis";
import { redisClient } from "./redis.js";

export class RedisCacheService {
	constructor(private readonly client: Redis) {}

	static createInstance(): RedisCacheService {
		return new RedisCacheService(redisClient);
	}

	async get<T>(key: string): Promise<T | null> {
		const value = await this.client.get(key);
		return value ? JSON.parse(value) : null;
	}

	async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
		await this.client.setex(key, ttlSeconds, JSON.stringify(value));
	}

	async delete(key: string): Promise<void> {
		await this.client.del(key);
	}

	async clear(): Promise<void> {
		await this.client.flushdb();
	}
}
