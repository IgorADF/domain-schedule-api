import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateCompleteAgendaSchema } from "@domain/use-cases/create-complete-agenda.js";
import { ListAvailableSlotsSchema } from "@domain/use-cases/list-available-slots.js";
import { createCompleteAgendaFactory } from "@/infra/use-cases-factories/create-complete-agenda.js";
import { listAgendaConfigFactory } from "@/infra/use-cases-factories/list-agenda-config.js";
import { listAvailableSlotsFactory } from "@/infra/use-cases-factories/list-available-slots.js";
import {
	DefaultErrorSchema,
	GetAgendaAvailableSlotsResponseSchema,
	GetAgendaResponseSchema,
	NoAgendaConfiguredErrorSchema,
	PostAgendaResponseSchema,
} from "./../schemas/responses.js";

export const initAgendaRoutes: InitRoute = (dbClient, logger, tags) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
					operationId: "getAgendaConfig",
					tags,
					description:
						"Get the agenda configuration for the authenticated seller",
					response: {
						200: GetAgendaResponseSchema,
						404: NoAgendaConfiguredErrorSchema,
					},
					security: [{ cookieAuth: [] }],
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = listAgendaConfigFactory(dbClient);

				const sellerId = request.authSeller.id;
				const { agendaConfig, agendaDaysOfWeek } =
					await useCase.execute(sellerId);

				return { data: { agendaConfig, agendaDaysOfWeek } };
			},
		);

		fastify.get(
			"/available-slots",
			{
				schema: {
					operationId: "listAvailableSlots",
					querystring: ListAvailableSlotsSchema,
					tags,
					description:
						"List available slots in the agenda for public scheduling",
					response: {
						200: GetAgendaAvailableSlotsResponseSchema,
						404: NoAgendaConfiguredErrorSchema,
					},
				},
			},
			async (request) => {
				const { useCase } = listAvailableSlotsFactory(dbClient);

				const { slots } = await useCase.execute({
					agendaConfigId: request.query.agendaConfigId,
					initialDate: request.query.initialDate,
					finalDate: request.query.finalDate,
				});

				return { data: slots };
			},
		);

		fastify.post(
			"/",
			{
				schema: {
					operationId: "createCompleteAgenda",
					body: CreateCompleteAgendaSchema.omit({ sellerId: true }),
					tags,
					description:
						"Create or update the complete agenda for the authenticated seller",
					response: {
						200: PostAgendaResponseSchema,
						409: DefaultErrorSchema.describe(
							"Agenda configuration already exists for the seller (ENTITY_ALREADY_EXIST)",
						),
					},
					security: [{ cookieAuth: [] }],
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = createCompleteAgendaFactory(dbClient);

				const sellerId = request.authSeller.id;
				const { agendaConfig } = await useCase.execute({
					...request.body,
					sellerId,
				});

				return { data: agendaConfig };
			},
		);
	};
};
