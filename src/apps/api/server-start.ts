import { authenticateDbConnection } from "@core/database/connection.js";
import { Envs } from "@core/envs/envs.js";
import { testRedisConnection } from "@/core/cache/redis.js";
import { fastifyInstance, logInfoOnServer } from "./server-config.js";

try {
	await authenticateDbConnection(logInfoOnServer);
	await testRedisConnection(logInfoOnServer);
	await fastifyInstance.listen({ port: Envs.API_PORT, host: "0.0.0.0" });
} catch (err) {
	fastifyInstance.log.error(err);
	process.exit(1);
}
