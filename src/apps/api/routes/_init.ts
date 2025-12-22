import type { FastifyZodInstance } from "../@types/fastity-instance.js";
import { initAgendaRoutes } from "./agenda.js";
import { initSellerRoutes } from "./seller.js";

export async function initRoutes(fastify: FastifyZodInstance) {
	fastify.register(initSellerRoutes(), { prefix: "sellers" });
	fastify.register(initAgendaRoutes(), { prefix: "agendas" });
}
