import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { FastityInitRoutes } from "@api/@types/init-routes.js";
import { authSellerFactory } from "@core/use-cases/factories/auth-seller.js";
import { createSellerFactory } from "@core/use-cases/factories/create-seller.js";
import { updateSellerFactory } from "@core/use-cases/factories/update-seller.js";
import { AuthSellerSchema } from "@domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "@domain/use-cases/create-seller.js";
import { UpdateSellerSchema } from "@domain/use-cases/update-seller.js";
import z from "zod";

export function initSellerRoutes(): FastityInitRoutes {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/auth",
			{ schema: { body: AuthSellerSchema } },
			async (request) => {
				const { useCase } = authSellerFactory();
				const result = await useCase.execute(request.body);

				const token = fastify.jwt.sign({
					id: result.sellerId,
					email: result.email,
				});

				return { token };
			},
		);

		fastify.post(
			"/",
			{ schema: { body: CreateSellerSchema } },
			async (request) => {
				const { useCase } = createSellerFactory();
				const result = await useCase.execute(request.body);
				return { data: result.data };
			},
		);

		fastify.patch(
			"/:id",
			{
				schema: {
					params: z.object({ id: z.uuid() }),
					body: UpdateSellerSchema.omit({ id: true }),
				},
			},
			async (request) => {
				const { id } = request.params;
				const { useCase } = updateSellerFactory();
				const result = await useCase.execute({ id, ...request.body });
				return { data: result.data };
			},
		);
	};
}
