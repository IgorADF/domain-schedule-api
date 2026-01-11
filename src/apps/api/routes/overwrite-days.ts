import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { CreateOverwriteDaysSchema } from "@domain/use-cases/create-overwrite-days.js";
import type { LogService } from "@/infra/services/log.js";
import { createOverwriteDaysFactory } from "@/infra/use-cases-factories/create-overwrite-days.js";
import {
	CreateOverwriteDaysResponseSchema,
	NoAgendaConfiguredErrorSchema,
} from "./../schemas/responses.js";

export const initOverwriteDaysRoutes: InitRoute = (
	logger: LogService,
	tags,
) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/",
			{
				schema: {
					body: CreateOverwriteDaysSchema.omit({ sellerId: true }),
					tags,
					description: "Public route to create new overwrite days for a seller",
					response: {
						200: CreateOverwriteDaysResponseSchema,
						404: NoAgendaConfiguredErrorSchema,
					},
					security: [{ cookieAuth: [] }],
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const { useCase } = createOverwriteDaysFactory();

				const sellerId = request.authSeller.id;
				const result = await useCase.execute({
					...request.body,
					sellerId,
				});

				return result;
			},
		);
	};
};
