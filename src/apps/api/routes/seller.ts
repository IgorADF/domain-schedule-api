import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { AuthSellerSchema } from "@domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "@domain/use-cases/create-seller.js";
import { UpdateSellerSchema } from "@domain/use-cases/update-seller.js";
import { AskSellerResetPasswordSchema } from "@/domain/use-cases/ask-seller-reset-password.js";
import { Envs } from "@/infra/envs/envs.js";
import type { LogService } from "@/infra/services/log.js";
import { askSellerResetPasswordFactory } from "@/infra/use-cases/factories/ask-seller-reset-password.js";
import { authSellerFactory } from "@/infra/use-cases/factories/auth-seller.js";
import { createSellerFactory } from "@/infra/use-cases/factories/create-seller.js";
import { updateSellerFactory } from "@/infra/use-cases/factories/update-seller.js";

export const initSellerRoutes: InitRoute = (logger: LogService) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/auth",
			{ schema: { body: AuthSellerSchema } },
			async (request, reply) => {
				const { useCase } = authSellerFactory(logger);
				const result = await useCase.execute(request.body);

				fastify.setSignTokensToReply(
					reply,
					{ id: result.sellerId, email: result.email },
					fastify.authTokenData,
					fastify.refreshTokenData,
				);
			},
		);

		fastify.post("/logout", async (request, reply) => {
			fastify.setLogoutTokensToReply(
				reply,
				fastify.authTokenData,
				fastify.refreshTokenData,
			);
		});

		fastify.post(
			"/ask-reset-password",
			{ schema: { body: AskSellerResetPasswordSchema } },
			async (request) => {
				const { useCase } = askSellerResetPasswordFactory();

				const jwtFunction = (payload: { id: string; email: string }) => {
					return fastify.jwtSign(payload, Envs.API_JWT_RESET_SECRET, {
						expiresIn: "15m",
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
			"/",
			{
				schema: {
					body: UpdateSellerSchema.omit({ id: true }),
				},
				onRequest: [fastify.authenticate],
			},
			async (request) => {
				const id = request?.authSeller?.id as string;
				const { useCase } = updateSellerFactory();
				const result = await useCase.execute({ id, ...request.body });
				return { data: result.data };
			},
		);
	};
};
