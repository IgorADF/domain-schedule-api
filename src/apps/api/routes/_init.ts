import { initSellerRoutes } from "./seller.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";

export async function initRoutes(fastify: FastifyZodInstance) {
  fastify.register(initSellerRoutes(), { prefix: "sellers" });
}
