import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { authSellerFactory } from "@core/use-cases/factories/auth-seller.js";
import { createSellerFactory } from "@core/use-cases/factories/create-seller.js";
import { updateSellerFactory } from "@core/use-cases/factories/update-seller.js";
import { AuthSellerSchema } from "@domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "@domain/use-cases/create-seller.js";
import { UpdateSellerSchema } from "@domain/use-cases/update-seller.js";
import z from "zod";
import { Envs } from "@/core/envs/envs.js";
import type { LogService } from "@/core/services/log.js";
import { askSellerResetPasswordFactory } from "@/core/use-cases/factories/ask-seller-reset-password.js";
import { AskSellerResetPasswordSchema } from "@/domain/use-cases/ask-seller-reset-password.js";

export const initSellerRoutes: InitRoute = (logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/auth",
			{ schema: { body: AuthSellerSchema } },
			async (request) => {
				const { useCase } = authSellerFactory(logger);
				const result = await useCase.execute(request.body);

				const token = fastify.jwt.sign({
					id: result.sellerId,
					email: result.email,
				});

				return { token };
			},
		);

		fastify.post(
			"/ask-reset-password",
			{ schema: { body: AskSellerResetPasswordSchema } },
			async (request) => {
				const { useCase } = askSellerResetPasswordFactory();

				const jwtFunction = (payload: { id: string; email: string }) => {
					return fastify.jwtSign(payload, {
						expiresIn: "15m",
						key: Envs.API_JWT_RESET_SECRET,
					});
				};

				await useCase.execute(request.body, jwtFunction);

				return { success: true };
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
};
