import type { LogService } from "@/infra/services/log.js";
import type { FastifyZodInstance } from "./fastity-instance.js";

export type FastityInitRoutes = (fastify: FastifyZodInstance) => Promise<void>;
export type InitRoute = (
	logger: LogService,
	schemaDefaultTags: string[],
) => FastityInitRoutes;
