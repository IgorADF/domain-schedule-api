import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import { LogService } from "@/infra/services/log.js";
import type { DbClient } from "../@types/db-client.js";
import { initAgendaRoutes } from "./agenda.js";
import { initAgendaEventRoutes } from "./agenda-event.js";
import { initAgendaScheduleRoutes } from "./agenda-schedule.js";
import { initOverwriteDaysRoutes } from "./overwrite-days.js";
import { initSellerRoutes } from "./seller.js";

export function initRoutes(dbClient: DbClient) {
	return async (fastify: FastifyZodInstance) => {
		const logger = LogService.create(fastify.log);

		fastify.get("/health", async () => {
			return { status: "ok" };
		});

		fastify.register(initSellerRoutes(dbClient, logger, ["seller"]), {
			prefix: "sellers",
		});
		fastify.register(initAgendaRoutes(dbClient, logger, ["agenda"]), {
			prefix: "agendas",
		});
		fastify.register(
			initAgendaScheduleRoutes(dbClient, logger, ["agenda-schedule"]),
			{
				prefix: "agenda-schedules",
			},
		);
		fastify.register(
			initAgendaEventRoutes(dbClient, logger, ["agenda-event"]),
			{
				prefix: "agenda-events",
			},
		);
		fastify.register(
			initOverwriteDaysRoutes(dbClient, logger, ["overwrite-day"]),
			{
				prefix: "overwrite-days",
			},
		);
	};
}
