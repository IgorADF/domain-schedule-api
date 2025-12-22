import z from "zod";
import { SequelizeUnitOfWork } from "../../../core/repository/uow/sequelize-unit-of-work.js";
import {
	CreateCompleteAgendaSchema,
	CreateCompleteAgendaUseCase,
} from "../../../domain/use-cases/create-complete-agenda.js";
import type { FastifyZodInstance } from "../@types/fastity-instance.js";
import type { FastityInitRoutes } from "../@types/init-routes.js";

export function initAgendaRoutes(): FastityInitRoutes {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/",
			{ schema: { body: CreateCompleteAgendaSchema } },
			async (request, reply) => {
				const uow = new SequelizeUnitOfWork();
				const useCase = new CreateCompleteAgendaUseCase(uow);
				await useCase.execute(request.body);
				return { success: true };
			},
		);
	};
}
