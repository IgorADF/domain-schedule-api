import type { FastifyZodInstance } from "@api/@types/fastity-instance.js";
import type { InitRoute } from "@api/@types/init-routes.js";
import { AuthSellerSchema } from "@domain/use-cases/auth-seller.js";
import { CreateSellerSchema } from "@domain/use-cases/create-seller.js";
import { AskSellerResetPasswordSchema } from "@/domain/use-cases/ask-seller-reset-password.js";
import { Envs } from "@/infra/envs/envs.js";
import { askSellerResetPasswordFactory } from "@/infra/use-cases-factories/ask-seller-reset-password.js";
import { authSellerFactory } from "@/infra/use-cases-factories/auth-seller.js";
import { createSellerFactory } from "@/infra/use-cases-factories/create-seller.js";
// import { updateSellerFactory } from "@/infra/use-cases-factories/update-seller.js";
import { jwtSign } from "../handlers/auth/jwt.js";
import {
	CreateSellerResponseSchema,
	DefaultErrorSchema,
	DefaultSuccessSchema,
} from "./../schemas/responses.js";

export const initSellerRoutes: InitRoute = (dbClient, logger, tags) => {
	return async (fastify: FastifyZodInstance) => {
		fastify.post(
			"/auth",
			{
				schema: {
					operationId: "authSeller",
					body: AuthSellerSchema,
					tags,
					description:
						"Authenticate a seller (system user) and obtain tokens via http cookies",
					response: {
						200: DefaultSuccessSchema,
						401: DefaultErrorSchema.describe(
							"Invalid email or password provided (INVALID_CREDENTIALS)",
						),
					},
				},
			},
			async (request, reply) => {
				const { useCase } = authSellerFactory(dbClient, logger);
				const { seller } = await useCase.execute(request.body);

				fastify.setSignTokensToReply(reply, {
					id: seller.id,
					email: seller.email,
				});

				return { success: true };
			},
		);

		fastify.post(
			"/validate-auth",
			{
				schema: {
					operationId: "validateAuth",
					tags,
					description:
						"Validate authentication by checking authentication middleware tokens in http cookies",
					response: {
						200: DefaultSuccessSchema,
					},
				},
				onRequest: [fastify.authenticate],
			},
			(async) => {
				return { success: true };
			},
		);

		fastify.post(
			"/logout",
			{
				schema: {
					operationId: "logoutSeller",
					tags,
					response: {
						200: DefaultSuccessSchema,
					},
				},
			},
			async (request, reply) => {
				fastify.setLogoutTokensToReply(reply);
				return { success: true };
			},
		);

		fastify.post(
			"/ask-reset-password",
			{
				schema: {
					operationId: "askSellerResetPassword",
					body: AskSellerResetPasswordSchema,
					tags,
					description:
						"Public route to ask for a password reset link to be sent to the seller's email",
					response: {
						200: DefaultSuccessSchema,
						400: DefaultErrorSchema.describe(
							"Error sending reset password email (SEND_EMAIL_ERROR)",
						),
					},
				},
			},
			async (request) => {
				const { useCase } = askSellerResetPasswordFactory(dbClient, logger);

				const jwtFunction = (payload: { id: string; email: string }) => {
					return jwtSign(payload, Envs.API_JWT_RESET_SECRET, {
						expiresIn: "15m",
					});
				};

				await useCase.execute(request.body, jwtFunction);

				return { success: true };
			},
		);

		fastify.post(
			"/",
			{
				schema: {
					operationId: "createSeller",
					body: CreateSellerSchema,
					tags,
					description: "Public route to create a new seller (system user)",
					response: {
						200: CreateSellerResponseSchema,
						409: DefaultErrorSchema.describe(
							"Seller with provided email already exists (ENTITY_ALREADY_EXIST)",
						),
					},
				},
			},
			async (request) => {
				const { useCase } = createSellerFactory(dbClient);
				const { seller } = await useCase.execute(request.body);
				return { data: seller };
			},
		);

		/* TODO ROUTE */
		// fastify.patch(
		// 	"/",
		// 	{
		// 		schema: {
		// 			body: UpdateSellerSchema.omit({ id: true }),
		// 			security: [{ cookieAuth: [] }],
		// 		},
		// 		onRequest: [fastify.authenticate],
		// 	},
		// 	async (request) => {
		// 		const id = request.authSeller.id;
		// 		const { useCase } = updateSellerFactory();
		// 		const result = await useCase.execute({ id, ...request.body });
		// 		return { data: result.data };
		// 	},
		// );
	};
};
