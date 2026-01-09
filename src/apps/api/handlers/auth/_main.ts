import cookie from "cookie";
import type { FastifyReply, FastifyRequest } from "fastify";
import { Envs } from "@/infra/envs/envs.js";
import type { AuthSeller } from "../../@types/auth-seller.js";
import type { FastifyZodInstance } from "../../@types/fastity-instance.js";
import { jwtVerify } from "./jwt.js";
import { authTokenData, refreshTokenData } from "./tokens-config.js";

export class AuthHandlerError extends Error {
	replyStatusCode = 401;
	uniqueCode: string;

	constructor(uniqueCode: string, message: string) {
		super(message);
		this.uniqueCode = uniqueCode;
	}

	static createCookieNotFoundError() {
		return new AuthHandlerError("Unauthorized", "No cookies found");
	}

	static createInvalidTokenError() {
		return new AuthHandlerError("Unauthorized", "Invalid token");
	}
}

export function authHandler(fastifyInstance: FastifyZodInstance) {
	return async (request: FastifyRequest, reply: FastifyReply) => {
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

		const authVerify = jwtVerify<AuthSeller>(
			authCookiesToken,
			Envs.API_AUTH_JWT_SECRET,
		);

		if (authVerify.error) {
			const refreshVerify = jwtVerify<AuthSeller>(
				refreshCookiesToken,
				Envs.API_REFRESH_JWT_SECRET,
			);

			if (refreshVerify.error) {
				throw AuthHandlerError.createInvalidTokenError();
			}

			const payload: AuthSeller = refreshVerify.payload;

			fastifyInstance.setSignTokensToReply(reply, payload);

			request.authSeller = payload;
		} else {
			request.authSeller = authVerify.payload;
		}
	};
}
