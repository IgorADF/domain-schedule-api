import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateCompleteAgendaSchema } from "@domain/use-cases/create-complete-agenda.js";
import type { LogService } from "@/infra/services/log.js";
import { createCompleteAgendaFactory } from "@/infra/use-cases/factories/create-complete-agenda.js";
import { listAgendaConfigFactory } from "@/infra/use-cases/factories/list-agenda-config.js";

export const initAgendaRoutes: InitRoute = (_logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get("/", { onRequest: [fastify.authenticate] }, async (request) => {
			const { useCase } = listAgendaConfigFactory();

			const sellerId = request.authSeller?.id as string;
			const result = await useCase.execute(sellerId);

			return result;
		});

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
