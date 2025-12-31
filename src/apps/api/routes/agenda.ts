import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { createCompleteAgendaFactory } from "@core/use-cases/factories/create-complete-agenda.js";
import { CreateCompleteAgendaSchema } from "@domain/use-cases/create-complete-agenda.js";
import type { LogService } from "@/core/services/log.js";

export const initAgendaRoutes: InitRoute = (logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/",
			{
				schema: { body: CreateCompleteAgendaSchema.omit({ sellerId: true }) },
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = createCompleteAgendaFactory();

				const sellerId = request.authSeller?.id as string;
				await useCase.execute({ ...request.body, sellerId });

				return { success: true };
			},
		);
	};
};
