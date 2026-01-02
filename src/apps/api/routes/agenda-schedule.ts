import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateAgendaScheduleSchema } from "@domain/use-cases/create-agenda-schedule.js";
import type { LogService } from "@/infra/services/log.js";
import { createAgendaScheduleFactory } from "@/infra/use-cases/factories/create-agenda-schedule.js";

export const initAgendaScheduleRoutes: InitRoute = (_logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/",
			{ schema: { body: CreateAgendaScheduleSchema } },
			async (request) => {
				const { useCase } = createAgendaScheduleFactory();
				const { data } = await useCase.execute(request.body);

				return { data };
			},
		);
	};
};
