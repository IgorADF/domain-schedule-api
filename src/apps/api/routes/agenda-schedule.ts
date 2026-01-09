import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateAgendaScheduleSchema } from "@domain/use-cases/create-agenda-schedule.js";
import { ListSellerSchedulesSchema } from "@domain/use-cases/list-seller-schedules.js";
import type { LogService } from "@/infra/services/log.js";
import { createAgendaScheduleFactory } from "@/infra/use-cases-factories/create-agenda-schedule.js";
import { listSellerSchedulesFactory } from "@/infra/use-cases-factories/list-seller-schedules.js";
import {
	CreateAgendaSchedulesResponseSchema,
	GetAgendaSchedulesResponseSchema,
	NoAgendaConfiguredErrorSchema,
} from "./schemas/responses.js";

export const initAgendaScheduleRoutes: InitRoute = (
	logger: LogService,
	tags,
) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
					querystring: ListSellerSchedulesSchema.omit({ sellerId: true }),
					tags,
					description:
						"List the schedules created in the agenda for the authenticated seller",
					response: {
						200: GetAgendaSchedulesResponseSchema,
						404: NoAgendaConfiguredErrorSchema,
					},
					security: [{ cookieAuth: [] }],
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = listSellerSchedulesFactory();

				const sellerId = request.authSeller.id;
				const result = await useCase.execute({
					sellerId,
					initialDate: request.query.initialDate,
					finalDate: request.query.finalDate,
				});

				return { data: result.data };
			},
		);

		fastify.post(
			"/",
			{
				schema: {
					body: CreateAgendaScheduleSchema,
					tags,
					description:
						"Create a new schedule in the agenda for the authenticated seller",
					response: {
						200: CreateAgendaSchedulesResponseSchema,
						400: fastify.DefaultErrorSchema.describe(
							"Agenda config do not allow scheduling in this date/time (SCHEDULE_TOO_SOON or SCHEDULE_TOO_FAR_AHEAD)",
						),
						409: fastify.DefaultErrorSchema.describe(
							"Slot not available (SLOT_NOT_AVAILABLE)",
						),
					},
					security: [{ cookieAuth: [] }],
				},
			},
			async (request) => {
				const { useCase } = createAgendaScheduleFactory();
				const { data } = await useCase.execute(request.body);

				return { data };
			},
		);
	};
};
