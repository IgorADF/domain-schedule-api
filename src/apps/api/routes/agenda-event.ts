import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { ListSellerAgendaEventsSchema } from "@domain/use-cases/list-seller-agenda-events.js";
import { listSellerAgendaEventsFactory } from "@/infra/use-cases-factories/list-seller-agenda-events.js";
import { DefaultErrorSchema } from "../schemas/_general.js";
import { ListSellerAgendaEventsResponseSchema } from "../schemas/agenda-event.js";

export const initAgendaEventRoutes: InitRoute = (dbClient, logger, tags) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
					operationId: "listSellerAgendaEvents",
					querystring: ListSellerAgendaEventsSchema.omit({ sellerId: true }),
					tags,
					description:
						"List paginated agenda events for the authenticated seller",
					security: [{ cookieAuth: [] }],
					response: {
						200: ListSellerAgendaEventsResponseSchema,
						404: DefaultErrorSchema.describe(
							"Agenda config not found (ENTITY_NOT_FOUND)",
						),
					},
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = listSellerAgendaEventsFactory(dbClient);
				const sellerId = request.authSeller.id;

				const agendaEvents = await useCase.execute({
					sellerId,
					page: request.query.page,
					pageSize: request.query.pageSize,
				});

				return { data: agendaEvents };
			},
		);
	};
};
