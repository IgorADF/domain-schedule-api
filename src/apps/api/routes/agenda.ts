import z from "zod";
import {
  CreateAgendaPeriodsSchema,
  CreateAgendaPeriodsUseCase,
} from "../../../domain/use-cases/create-agenda-periods.js";
import { FastifyZodInstance } from "../@types/fastity-instance.js";
import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";
import { FastityInitRoutes } from "../@types/init-routes.js";

export function initAgendaRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/periods",
      { schema: { body: CreateAgendaPeriodsSchema } },
      async function (request, reply) {
        const uow = new SequelizeUnitOfWork();
        const sup = new CreateAgendaPeriodsUseCase(uow);
        const useCase = await sup.execute(request.body);
        return { data: useCase.data };
      }
    );
  };
}
