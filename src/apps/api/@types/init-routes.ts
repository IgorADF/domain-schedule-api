import type { LogService } from "@/infra/services/log.js";
import type { DbClient } from "./db-client.js";
import type { FastifyZodInstance } from "./fastity-instance.js";

export type FastityInitRoutes = (fastify: FastifyZodInstance) => Promise<void>;
export type InitRoute = (
	dbClient: DbClient,
	logger: LogService,
	schemaDefaultTags: string[],
) => FastityInitRoutes;
