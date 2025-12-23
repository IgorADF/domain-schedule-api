import type { SequelizeUnitOfWork } from "@core/repository/uow/sequelize-unit-of-work.js";
import type { FastifyZodInstance } from "./fastity-instance.js";

export type FastityInitRoutes = (fastify: FastifyZodInstance) => Promise<void>;
export type APIInitRoutes = (uow: SequelizeUnitOfWork) => FastityInitRoutes;
