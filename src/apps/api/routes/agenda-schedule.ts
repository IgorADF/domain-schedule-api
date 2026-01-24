import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import z from "zod";
import { CreateAgendaScheduleSchema } from "@domain/use-cases/create-agenda-schedule.js";
import { ListSellerSchedulesSchema } from "@domain/use-cases/list-seller-schedules.js";
import { createAgendaScheduleFactory } from "@/infra/use-cases-factories/create-agenda-schedule.js";
import { listSellerSchedulesFactory } from "@/infra/use-cases-factories/list-seller-schedules.js";
import { deleteAgendaScheduleFactory } from "@/infra/use-cases-factories/delete-agenda-schedule.js";
import {
	DefaultErrorSchema,
	NoAgendaConfiguredErrorSchema,
} from "../schemas/_general.js";
import {
	CreateAgendaSchedulesResponseSchema,
	DeleteAgendaScheduleResponseSchema,
	GetAgendaSchedulesResponseSchema,
} from "../schemas/agenda-schedule.js";

export const initAgendaScheduleRoutes: InitRoute = (dbClient, logger, tags) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
					operationId: "listSellerSchedules",
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
				const { useCase } = listSellerSchedulesFactory(dbClient);

				const sellerId = request.authSeller.id;
				const { groupedSchedules } = await useCase.execute({
					sellerId,
					initialDate: request.query.initialDate,
					finalDate: request.query.finalDate,
				});

				return { data: { groupedSchedules } };
			},
		);

		fastify.post(
			"/",
			{
				schema: {
					operationId: "createAgendaSchedule",
					body: CreateAgendaScheduleSchema,
					tags,
					description:
						"Create a new schedule in the agenda for the authenticated seller",
					response: {
						200: CreateAgendaSchedulesResponseSchema,
						400: DefaultErrorSchema.describe(
							"Agenda config do not allow scheduling in this date/time (SCHEDULE_TOO_SOON or SCHEDULE_TOO_FAR_AHEAD)",
						),
						409: DefaultErrorSchema.describe(
							"Slot not available (SLOT_NOT_AVAILABLE)",
						),
					},
				},
			},
			async (request) => {
				const { useCase } = createAgendaScheduleFactory(dbClient);
				const { schedule } = await useCase.execute(request.body);
				return { data: schedule };
			},
		);

		fastify.delete(
			"/:id",
			{
				schema: {
					operationId: "deleteAgendaSchedule",
					params: z.object({ id: z.string() }),
					tags,
					description: "Delete a schedule from the agenda",
					response: {
						204: DeleteAgendaScheduleResponseSchema,
						404: DefaultErrorSchema.describe(
							"Schedule not found or unauthorized",
						),
					},
				},
				onRequest: [fastify.authenticate],
			},
			async (request, reply) => {
				const { useCase } = deleteAgendaScheduleFactory(dbClient);
				await useCase.execute({
					id: request.params.id,
					sellerId: request.authSeller.id,
				});
				return reply.status(204).send();
			},
		);
	};
};
