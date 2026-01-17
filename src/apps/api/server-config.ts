import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cookie from "cookie";
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	jsonSchemaTransformObject,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { Envs } from "@/infra/envs/envs.js";
import type { DbClient } from "./@types/db-client.js";
import type { FastifyZodInstance } from "./@types/fastity-instance.js";
import { authHandler } from "./handlers/auth/_main.js";
import { jwtSign } from "./handlers/auth/jwt.js";
import {
	authTokenData,
	refreshTokenData,
} from "./handlers/auth/tokens-config.js";
import { errorHandler } from "./handlers/errors/_main.js";
import { initRoutes } from "./routes/_init.js";

function setFastifyInstanceDecorators(fastifyInstance: FastifyZodInstance) {
	// decorateRequest and authSeller implemented according docs patterns
	fastifyInstance.decorateRequest("authSeller");
	fastifyInstance.addHook("onRequest", async (req) => {
		req.authSeller = {
			id: "",
			email: "",
		};
	});

	fastifyInstance.decorate(
		"createAuthCookie",
		(tokenName, TokenValue, maxAge) => {
			const cookieString = cookie.serialize(tokenName, TokenValue, {
				httpOnly: true,
				path: "/",
				maxAge,
				sameSite: "lax",
				secure: Envs.isProdEnv,
			});

			return cookieString;
		},
	);

	fastifyInstance.decorate("setSignTokensToReply", (reply, payload) => {
		const authTokenValue = jwtSign(payload, Envs.API_AUTH_JWT_SECRET, {
			expiresIn: `${authTokenData.expireInSeconds}s`,
		});

		const authCookie = fastifyInstance.createAuthCookie(
			authTokenData.name,
			authTokenValue,
			authTokenData.expireInSeconds,
		);

		const refreshTokenValue = jwtSign(payload, Envs.API_REFRESH_JWT_SECRET, {
			expiresIn: `${refreshTokenData.expireInSeconds}s`,
		});

		const refreshCookie = fastifyInstance.createAuthCookie(
			refreshTokenData.name,
			refreshTokenValue,
			refreshTokenData.expireInSeconds,
		);

		reply.header("set-cookie", [authCookie, refreshCookie]);
	});

	fastifyInstance.decorate("setLogoutTokensToReply", (reply) => {
		const authCookieLougout = fastifyInstance.createAuthCookie(
			authTokenData.name,
			"",
			0,
		);

		const refreshCookieLougout = fastifyInstance.createAuthCookie(
			refreshTokenData.name,
			"",
			0,
		);

		reply.header("set-cookie", [authCookieLougout, refreshCookieLougout]);
	});

	fastifyInstance.decorate("authenticate", authHandler(fastifyInstance));
}

async function setSwaggerConfig(fastifyInstance: FastifyZodInstance) {
	if (Envs.isTestEnv) {
		return;
	}

	await fastifyInstance.register(swagger, {
		openapi: {
			openapi: "3.0.0",
			info: {
				title: "Swagger Documentation",
				version: "0.1.0",
			},
			tags: [
				{
					name: "seller",
					description:
						"Seller related end-points, including authentication and management.",
				},
				{
					name: "overwrite-days",
					description:
						"Seller Overwrite Days related end-points, including management of overwrite days. Overwrite days are specific dates where a seller can define custom availability, overriding their regular schedule.",
				},
				{
					name: "agenda",
					description:
						"Agenda related end-points, including retrieval of agenda configurations and available slots for sellers.",
				},
				{
					name: "agenda-schedule",
					description:
						"Agenda Schedule related end-points, including management of regular weekly schedules for sellers.",
				},
			],
			components: {
				securitySchemes: {
					cookieAuth: {
						type: "apiKey",
						in: "cookie",
						name: authTokenData.name,
					},
				},
			},
		},
		transform: jsonSchemaTransform,
		transformObject: jsonSchemaTransformObject,
	});

	await fastifyInstance.register(swaggerUI, {
		routePrefix: "/documentation",
	});
}

export async function createFastifyInstance(dbClient: DbClient) {
	const fastifyInstance = Fastify({
		logger: {
			level: "info",
			transport: {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			},
		},
	}).withTypeProvider<ZodTypeProvider>();

	fastifyInstance.setValidatorCompiler(validatorCompiler);
	fastifyInstance.setSerializerCompiler(serializerCompiler);

	setFastifyInstanceDecorators(fastifyInstance);

	await setSwaggerConfig(fastifyInstance);

	fastifyInstance.setErrorHandler(errorHandler);

	fastifyInstance.register(initRoutes(dbClient));

	return fastifyInstance;
}
