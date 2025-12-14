import { initSellerRoutes } from "./seller.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";
import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";

export async function initRoutes(fastify: FastifyZodInstance) {
  const uow = new SequelizeUnitOfWork();

  fastify.register(initSellerRoutes(uow), { prefix: "sellers" });
}
