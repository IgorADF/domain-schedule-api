import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateAgendaScheduleSchema } from "@domain/use-cases/create-agenda-schedule.js";
import { ListSellerSchedulesSchema } from "@domain/use-cases/list-seller-schedules.js";
import type { LogService } from "@/infra/services/log.js";
import { createAgendaScheduleFactory } from "@/infra/use-cases/factories/create-agenda-schedule.js";
import { listSellerSchedulesFactory } from "@/infra/use-cases/factories/list-seller-schedules.js";

export const initAgendaScheduleRoutes: InitRoute = (_logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
					querystring: ListSellerSchedulesSchema.omit({ sellerId: true }),
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = listSellerSchedulesFactory();

				const sellerId = request.authSeller?.id as string;
				const result = await useCase.execute({
					sellerId,
					initialDate: request.query.initialDate,
					finalDate: request.query.finalDate,
				});

				return result;
			},
		);

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
