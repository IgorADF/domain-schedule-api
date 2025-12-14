import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";
import { FastifyZodInstance } from "./fastity-instance.js";

export type FastityInitRoutes = (fastify: FastifyZodInstance) => Promise<void>;
export type APIInitRoutes = (uow: SequelizeUnitOfWork) => FastityInitRoutes;
