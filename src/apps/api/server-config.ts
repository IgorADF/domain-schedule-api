import cookie from "cookie";
import Fastify, { type FastifyReply, type FastifyRequest } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import jwt from "jsonwebtoken";
import { Envs } from "@/infra/envs/envs.js";
import type { AuthSeller } from "./@types/auth-seller.js";
import type { FastifyZodInstance } from "./@types/fastity-instance.js";
import { errorHandler } from "./handlers/errors.js";
import { initRoutes } from "./routes/_init.js";

function setFastifyInstanceDecorators(fastifyInstance: FastifyZodInstance) {
	fastifyInstance.decorateRequest("authSeller", {
		id: "",
		email: "",
	});

	fastifyInstance.decorate("authTokenData", {
		name: "sat_" + "2ae997cea374",
		expireInSeconds: 60 * 15, // 15 minutes
	});

	fastifyInstance.decorate("refreshTokenData", {
		name: "srt_" + "22ebd85ae574",
		expireInSeconds: 60 * 60 * 24 * 7, // 7 days
	});

	fastifyInstance.decorate(
		"jwtVerify",
		(token, secretOrPrivateKey, options) => {
			try {
				const result = jwt.verify(token, secretOrPrivateKey, options);
				return { payload: result, error: false };
			} catch {
				return { payload: null, error: true };
			}
		},
	);

	fastifyInstance.decorate(
		"jwtSign",
		(payload, secretOrPrivateKey, options) => {
			return jwt.sign(payload, secretOrPrivateKey, options);
		},
	);

	fastifyInstance.decorate("createCookie", (tokenName, TokenValue, maxAge) => {
		return `${tokenName}=${TokenValue}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${Envs.NODE_ENV === "production" ? "; Secure" : ""}`;
	});

	fastifyInstance.decorate(
		"setSignTokensToReply",
		(reply, payload, authTokenData, refreshTokenData) => {
			const authTokenValue = fastifyInstance.jwtSign(
				payload,
				Envs.API_AUTH_JWT_SECRET,
				{ expiresIn: `${authTokenData.expireInSeconds}s` },
			);

			const authCookie = fastifyInstance.createCookie(
				authTokenData.name,
				authTokenValue,
				authTokenData.expireInSeconds,
			);

			const refreshTokenValue = fastifyInstance.jwtSign(
				payload,
				Envs.API_REFRESH_JWT_SECRET,
				{ expiresIn: `${refreshTokenData.expireInSeconds}s` },
			);

			const refreshCookie = fastifyInstance.createCookie(
				refreshTokenData.name,
				refreshTokenValue,
				refreshTokenData.expireInSeconds,
			);

			reply.header("set-cookie", [authCookie, refreshCookie]);
		},
	);

	fastifyInstance.decorate(
		"setLogoutTokensToReply",
		(reply, authTokenData, refreshTokenData) => {
			const authCookieLougout = fastifyInstance.createCookie(
				authTokenData.name,
				"",
				0,
			);

			const refreshCookieLougout = fastifyInstance.createCookie(
				refreshTokenData.name,
				"",
				0,
			);

			reply.header("set-cookie", [authCookieLougout, refreshCookieLougout]);
		},
	);

	fastifyInstance.decorate(
		"authenticate",
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const cookiesHeader = request.headers?.cookie;
				if (!cookiesHeader) {
					throw { cookiesNotFound: true };
				}

				const cookieObject = cookie.parseCookie(cookiesHeader);

				const authTokenData = fastifyInstance.authTokenData;
				const authCookiesToken = cookieObject[authTokenData.name];
				if (!authCookiesToken) {
					throw { cookiesNotFound: true };
				}

				const refreshTokenData = fastifyInstance.refreshTokenData;
				const refreshCookiesToken = cookieObject[refreshTokenData.name];
				if (!refreshCookiesToken) {
					throw { cookiesNotFound: true };
				}

				const authVerify = fastifyInstance.jwtVerify<AuthSeller>(
					authCookiesToken,
					Envs.API_AUTH_JWT_SECRET,
				);

				if (authVerify.error) {
					const refreshVerify = fastifyInstance.jwtVerify<AuthSeller>(
						refreshCookiesToken,
						Envs.API_REFRESH_JWT_SECRET,
					);

					if (refreshVerify.error) {
						throw { invalidToken: true };
					}

					const payload: AuthSeller = {
						id: refreshVerify.payload.id,
						email: refreshVerify.payload.email,
					};

					fastifyInstance.setSignTokensToReply(
						reply,
						payload,
						fastifyInstance.authTokenData,
						fastifyInstance.refreshTokenData,
					);

					request.authSeller = payload;
				} else {
					request.authSeller = authVerify.payload;
				}
			} catch (err: any) {
				if (err?.cookiesNotFound) {
					return reply
						.status(401)
						.send({ code: "Unauthorized", error: "No cookies found" });
				}

				reply.status(401).send({
					code: "Unauthorized",
					error: err?.message || "Invalid token",
				});
			}
		},
	);
}

function createFastifyInstance() {
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

	fastifyInstance.setErrorHandler(errorHandler);

	setFastifyInstanceDecorators(fastifyInstance);

	fastifyInstance.register(initRoutes);

	return fastifyInstance;
}

export const fastifyInstance = createFastifyInstance();

export function logInfoOnServer(message: string) {
	fastifyInstance.log.info(message);
}
