import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { ListSellerAgendaEventsSchema } from "@domain/use-cases/list-seller-agenda-events.js";
import type { LogService } from "@/infra/services/log.js";
import { listSellerAgendaEventsFactory } from "@/infra/use-cases-factories/list-seller-agenda-events.js";
import {
	DefaultErrorSchema,
	ListSellerAgendaEventsResponseSchema,
} from "./schemas/responses.js";

export const initAgendaEventRoutes: InitRoute = (logger: LogService, tags) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.get(
			"/",
			{
				schema: {
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
				const { useCase } = listSellerAgendaEventsFactory();
				const sellerId = request.authSeller.id;

				const result = await useCase.execute({
					sellerId,
					page: request.query.page,
					pageSize: request.query.pageSize,
				});

				return result;
			},
		);
	};
};
