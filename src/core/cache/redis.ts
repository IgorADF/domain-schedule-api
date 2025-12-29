import { Redis } from "ioredis";
import { Envs } from "../envs/envs.js";

export const redisClient = Envs.REDIS_ENABLE
	? new Redis({
			host: Envs.REDIS_HOST,
			port: Envs.REDIS_PORT,
		})
	: null;

export async function testRedisConnection(
	logInfoCallback: (msg: string) => void,
) {
	if (!redisClient) {
		logInfoCallback("Redis is disabled in the environment settings");
		return;
	}

	const ping = await redisClient.ping();

	if (ping !== "PONG") {
		throw new Error("Unable to connect to Redis");
	}

	logInfoCallback("Redis connection established");
}
