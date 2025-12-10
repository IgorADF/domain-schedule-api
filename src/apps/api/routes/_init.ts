import { FastifyInstance } from "fastify";
import { initSellerRoutes } from "./seller.js";

export async function initRoutes(fastify: FastifyInstance) {
  fastify.register(initSellerRoutes, { prefix: "sellers" });
}
