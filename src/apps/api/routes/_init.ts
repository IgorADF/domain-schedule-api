import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import { LogService } from "@/core/services/log.js";
import { initAgendaRoutes } from "./agenda.js";
import { initSellerRoutes } from "./seller.js";

export async function initRoutes(fastify: FastifyZodInstance) {
	const logger = new LogService(fastify.log);

	fastify.get("/health", async () => {
		return { status: "ok" };
	});

	fastify.register(initSellerRoutes(logger), { prefix: "sellers" });
	fastify.register(initAgendaRoutes(logger), { prefix: "agendas" });
}
