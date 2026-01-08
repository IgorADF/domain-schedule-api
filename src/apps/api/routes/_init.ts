import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import { createLogService } from "@/infra/services/factories/log.js";
import { initAgendaRoutes } from "./agenda.js";
import { initAgendaEventRoutes } from "./agenda-event.js";
import { initAgendaScheduleRoutes } from "./agenda-schedule.js";
import { initOverwriteDaysRoutes } from "./overwrite-days.js";
import { initSellerRoutes } from "./seller.js";

export async function initRoutes(fastify: FastifyZodInstance) {
	const logger = createLogService(fastify.log).service;

	fastify.get("/health", async () => {
		return { status: "ok" };
	});

	fastify.register(initSellerRoutes(logger, ["seller"]), { prefix: "sellers" });
	fastify.register(initAgendaRoutes(logger, ["agenda"]), { prefix: "agendas" });
	fastify.register(initAgendaScheduleRoutes(logger, ["agenda-schedule"]), {
		prefix: "agenda-schedules",
	});
	fastify.register(initAgendaEventRoutes(logger, ["agenda-event"]), {
		prefix: "agenda-events",
	});
	fastify.register(initOverwriteDaysRoutes(logger, ["overwrite-day"]), {
		prefix: "overwrite-days",
	});
}
