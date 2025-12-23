import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { FastityInitRoutes } from "@api/@types/init-routes.js";
import { createCompleteAgendaFactory } from "@core/use-cases/factories/create-complete-agenda.js";
import { CreateCompleteAgendaSchema } from "@domain/use-cases/create-complete-agenda.js";

export function initAgendaRoutes(): FastityInitRoutes {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/",
			{ schema: { body: CreateCompleteAgendaSchema } },
			async (request, reply) => {
				const { useCase } = createCompleteAgendaFactory();
				await useCase.execute(request.body);
				return { success: true };
			},
		);
	};
}
