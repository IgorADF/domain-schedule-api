import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import { createLogService } from "@/infra/services/factories/log.js";
import { initAgendaRoutes } from "./agenda.js";
import { initAgendaScheduleRoutes } from "./agenda-schedule.js";
import { initOverwriteDaysRoutes } from "./overwrite-days.js";
import { initSellerRoutes } from "./seller.js";

export async function initRoutes(fastify: FastifyZodInstance) {
	const logger = createLogService(fastify.log).service;

	fastify.get("/health", async () => {
		return { status: "ok" };
	});

	fastify.register(initSellerRoutes(logger), { prefix: "sellers" });
	fastify.register(initAgendaRoutes(logger), { prefix: "agendas" });
	fastify.register(initAgendaScheduleRoutes(logger), {
		prefix: "agenda-schedules",
	});
	fastify.register(initOverwriteDaysRoutes(logger), {
		prefix: "overwrite-days",
	});
}
