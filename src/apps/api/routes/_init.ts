import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import { initAgendaRoutes } from "./agenda.js";
import { initSellerRoutes } from "./seller.js";
import { createLogService } from "@/core/services/factories/log.js";

export async function initRoutes(fastify: FastifyZodInstance) {
	const logger = createLogService(fastify.log).service;

	fastify.get("/health", async () => {
		return { status: "ok" };
	});

	fastify.register(initSellerRoutes(logger), { prefix: "sellers" });
	fastify.register(initAgendaRoutes(logger), { prefix: "agendas" });
}
