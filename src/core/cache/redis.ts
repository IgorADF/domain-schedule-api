import { Redis } from "ioredis";
import { Envs } from "../envs/envs.js";

export const redisClient = new Redis({
	host: Envs.REDIS_HOST,
	port: Envs.REDIS_PORT,
});

export async function testRedisConnection(
	logInfoCallback: (msg: string) => void,
) {
	const ping = await redisClient.ping();

	if (ping !== "PONG") {
		throw new Error("Unable to connect to Redis");
	}

	logInfoCallback("Redis connection established");
}
