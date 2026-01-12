import cookie from "cookie";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Envs } from "@/infra/envs/envs.js";
import type { AuthSeller } from "../../@types/auth-seller.js";
import type { FastifyZodInstance } from "../../@types/fastity-instance.js";
import { AuthHandlerError } from "./error-class.js";
import { jwtVerify } from "./jwt.js";
import { authTokenData, refreshTokenData } from "./tokens-config.js";

export function authHandler(fastifyInstance: FastifyZodInstance) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		try {
			const cookiesHeader = request?.headers?.cookie;
			if (!cookiesHeader) {
				throw AuthHandlerError.createCookieNotFoundError();
			}

			const cookieObject = cookie.parseCookie(cookiesHeader);

			const authCookiesToken = cookieObject?.[authTokenData.name];
			if (!authCookiesToken) {
				throw AuthHandlerError.createCookieNotFoundError();
			}

			const refreshCookiesToken = cookieObject?.[refreshTokenData.name];
			if (!refreshCookiesToken) {
				throw AuthHandlerError.createCookieNotFoundError();
			}

			const authVerify = jwtVerify(authCookiesToken, Envs.API_AUTH_JWT_SECRET);

			if (authVerify.error) {
				const refreshVerify = jwtVerify(
					refreshCookiesToken,
					Envs.API_REFRESH_JWT_SECRET,
				);

				if (refreshVerify.error) {
					throw AuthHandlerError.createInvalidTokenError();
				}

				const payload: AuthSeller = {
					id: refreshVerify.payload.id,
					email: refreshVerify.payload.email,
				};

				fastifyInstance.setSignTokensToReply(reply, payload);

				request.authSeller = payload;
			} else {
				const payload: AuthSeller = {
					id: authVerify.payload.id,
					email: authVerify.payload.email,
				};

				request.authSeller = payload;
			}
		} catch (error) {
			fastifyInstance.setLogoutTokensToReply(reply);
			throw error;
		}
	};
}
