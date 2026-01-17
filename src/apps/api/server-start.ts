import { testRedisConnection } from "@/infra/cache/redis.js";
import { authenticateDbConnection } from "@/infra/database/helpers/authenticate-connection.js";
import { createDbClient } from "@/infra/database/helpers/create-client.js";
import { Envs } from "@/infra/envs/envs.js";
import type { FastifyZodInstance } from "./@types/fastity-instance.js";
import { createFastifyInstance } from "./server-config.js";

async function bootServer() {
	let fastifyInstance: FastifyZodInstance | null = null;

	try {
		const { prisma: dbClient } = createDbClient(Envs.DATABASE_URL);
		fastifyInstance = await createFastifyInstance(dbClient);

		if (!fastifyInstance) {
			throw new Error("Fastify instance is not defined");
		}

		const logInfoOnServer = (message: string) => {
			fastifyInstance?.log?.info?.(message);
		};

		await authenticateDbConnection(dbClient, logInfoOnServer);
		await testRedisConnection(logInfoOnServer);
		await fastifyInstance.listen({ port: Envs.API_PORT, host: "0.0.0.0" });
	} catch (err) {
		if (fastifyInstance) {
			fastifyInstance.log.error(err);
		}

		process.exit(1);
	}
}

bootServer();
