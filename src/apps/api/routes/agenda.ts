import z from "zod";
import { createCompleteAgendaFactory } from "../../../core/use-cases/factories/create-complete-agenda.js";
import { CreateCompleteAgendaSchema } from "../../../domain/use-cases/create-complete-agenda.js";
import type { FastifyZodInstance } from "../@types/fastity-instance.js";
import type { FastityInitRoutes } from "../@types/init-routes.js";

export function initAgendaRoutes(): FastityInitRoutes {
  return async (fastify: FastifyZodInstance) => {
    fastify.post(
      "/",
      { schema: { body: CreateCompleteAgendaSchema } },
      async (request, reply) => {
        const { useCase } = createCompleteAgendaFactory();
        await useCase.execute(request.body);
        return { success: true };
      }
    );
  };
}
