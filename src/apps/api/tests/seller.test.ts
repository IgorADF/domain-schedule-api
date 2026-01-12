import type { Server } from "node:http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { Envs } from "@/infra/envs/envs.js";
import type { AuthSeller } from "../@types/auth-seller.js";
import { jwtSign, jwtVerify } from "../handlers/auth/jwt.js";
import {
	authTokenData,
	refreshTokenData,
} from "../handlers/auth/tokens-config.js";
import { runFinalTestConfigs, runInitTestConfigs } from "./helpers/_config.js";
import { awaitTimer } from "./helpers/await.js";
import {
	authTestSeller,
	createTestSeller,
	formatSetHeaderCookie,
	parseResponseSellerAuthCookies,
} from "./helpers/seller.js";

const sendEmailMock = vi.fn().mockResolvedValue(undefined);
vi.mock("@/infra/services/queue.js", () => {
	class QueueService {
		static create() {
			return new QueueService();
		}

		sendEmail = sendEmailMock;
	}

	return { QueueService };
});

let server: Server;

describe("Seller Routes", () => {
	beforeAll(async () => {
		server = (await runInitTestConfigs()).server;
	});

	afterAll(async () => {
		await runFinalTestConfigs();
	});

	describe("POST /sellers", () => {
		it("should create a new seller with valid data", async () => {
			const response = await request(server).post("/sellers").send({
				name: "Test Seller",
				email: "test@example.com",
				password: "password123",
			});

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("data");
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data.email).toBe("test@example.com");
			expect(response.body.data.name).toBe("Test Seller");
			expect(response.body.data).not.toHaveProperty("password");
		});

		it("should fail when creating seller with duplicate email", async () => {
			const sellerData = {
				name: "Duplicate Seller",
				email: "duplicate@example.com",
				password: "password123",
			};

			await request(server).post("/sellers").send(sellerData);

			const response = await request(server).post("/sellers").send(sellerData);

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("ENTITY_ALREADY_EXIST");
		});

		it("should fail with invalid email", async () => {
			const response = await request(server).post("/sellers").send({
				name: "Test Seller",
				email: "invalid-email",
				password: "password123",
			});

			expect(response.status).toBe(400);
		});

		it("should fail with short password", async () => {
			const response = await request(server).post("/sellers").send({
				name: "Test Seller",
				email: "test2@example.com",
				password: "short",
			});

			expect(response.status).toBe(400);
		});

		it("should fail with missing required fields", async () => {
			const response = await request(server).post("/sellers").send({
				email: "test3@example.com",
			});

			expect(response.status).toBe(400);
		});
	});

	describe("POST /sellers/auth", () => {
		beforeAll(async () => {
			await request(server).post("/sellers").send({
				name: "Auth Test Seller",
				email: "auth@example.com",
				password: "password123",
			});
		});

		it("should authenticate seller with valid credentials and set cookies(auth/refresh)", async () => {
			const response = await request(server).post("/sellers/auth").send({
				email: "auth@example.com",
				password: "password123",
			});

			const { cookieSat, cookieSrt } = parseResponseSellerAuthCookies(response);

			expect(response.status).toBe(200);

			expect(cookieSat.name).toBeDefined();
			expect(cookieSat.value).toBeDefined();
			expect(cookieSat.httpOnly).toBe(true);
			expect(cookieSat.maxAge).toBe(authTokenData.expireInSeconds);
			expect(cookieSat.path).toBe("/");
			expect(cookieSat.sameSite).toBe("lax");

			expect(cookieSrt.name).toBeDefined();
			expect(cookieSrt.value).toBeDefined();
			expect(cookieSrt.httpOnly).toBe(true);
			expect(cookieSrt.path).toBe("/");
			expect(cookieSrt.sameSite).toBe("lax");
			expect(cookieSrt.maxAge).toBe(refreshTokenData.expireInSeconds);

			expect(cookieSat.value).not.toBe(cookieSrt.value);
		});

		it("should fail with invalid password", async () => {
			const response = await request(server).post("/sellers/auth").send({
				email: "auth@example.com",
				password: "wrongpassword",
			});

			expect(response.status).toBe(401);
			expect(response.body.error).toBe("INVALID_CREDENTIALS");
		});

		it("should fail with non-existent email", async () => {
			const response = await request(server).post("/sellers/auth").send({
				email: "nonexistent@example.com",
				password: "password123",
			});

			expect(response.status).toBe(401);
			expect(response.body.error).toBe("INVALID_CREDENTIALS");
		});

		it("should fail with invalid email format", async () => {
			const response = await request(server).post("/sellers/auth").send({
				email: "invalid-email",
				password: "password123",
			});

			expect(response.status).toBe(400);
		});
	});

	describe("POST /sellers/validate-auth", () => {
		const email = "validate@example.com";

		beforeAll(async () => {
			await createTestSeller(server, {
				email,
			});
		});

		it("should authenticate seller with valid credentials", async () => {
			const { formattedCookies } = await authTestSeller(server, {
				email,
			});

			const response = await request(server)
				.post("/sellers/validate-auth")
				.set("Cookie", formattedCookies)
				.send();

			expect(response.status).toBe(200);
		});

		it("should authenticate via refresh with auth token expired and reset both tokens", async () => {
			const { cookieSat: authCookieSat, cookieSrt: authCookieSrt } =
				await authTestSeller(server, {
					email,
				});

			const { payload, error } = jwtVerify(
				authCookieSrt.value as string,
				Envs.API_REFRESH_JWT_SECRET,
			);

			if (error) {
				throw new Error("Failed to verify refresh token");
			}

			const newPayload: AuthSeller = {
				id: payload.id,
				email: payload.email,
			};

			const expiredAuthTokenValue = jwtSign(
				newPayload,
				Envs.API_AUTH_JWT_SECRET,
				{
					expiresIn: "-10s",
				},
			);

			const formattedCookieSat = formatSetHeaderCookie({
				name: authCookieSat.name,
				value: expiredAuthTokenValue,
			});

			const formattedCookieSrt = formatSetHeaderCookie({
				name: authCookieSrt.name,
				value: authCookieSrt.value,
			});

			await awaitTimer(1100); // Wait to ensure old and new tokens do not match jwt exp iat

			const response = await request(server)
				.post("/sellers/validate-auth")
				.set("Cookie", [formattedCookieSat, formattedCookieSrt])
				.send();

			const { cookieSat: responseCookieSat, cookieSrt: responseCookieSrt } =
				parseResponseSellerAuthCookies(response);

			expect(response.status).toBe(200);

			expect(responseCookieSat.name).toBeDefined();
			expect(responseCookieSat.value).toBeDefined();
			expect(responseCookieSat.httpOnly).toBe(true);
			expect(responseCookieSat.maxAge).toBe(authTokenData.expireInSeconds);
			expect(responseCookieSat.path).toBe("/");
			expect(responseCookieSat.sameSite).toBe("lax");

			expect(responseCookieSrt.name).toBeDefined();
			expect(responseCookieSrt.value).toBeDefined();
			expect(responseCookieSrt.httpOnly).toBe(true);
			expect(responseCookieSrt.path).toBe("/");
			expect(responseCookieSrt.sameSite).toBe("lax");
			expect(responseCookieSrt.maxAge).toBe(refreshTokenData.expireInSeconds);

			expect(authCookieSat.value !== responseCookieSat.value).toBe(true);
			expect(expiredAuthTokenValue !== responseCookieSat.value).toBe(true);
			expect(authCookieSrt.value !== responseCookieSrt.value).toBe(true);
			expect(responseCookieSat.value).not.toBe(responseCookieSrt.value);
		});

		it("should throw error with auth and refresh token expired", async () => {
			const { cookieSat: authCookieSat, cookieSrt: authCookieSrt } =
				await authTestSeller(server, {
					email,
				});

			const { payload, error } = jwtVerify(
				authCookieSrt.value as string,
				Envs.API_REFRESH_JWT_SECRET,
			);

			if (error) {
				throw new Error("Failed to verify refresh token");
			}

			const newPayload: AuthSeller = {
				id: payload.id,
				email: payload.email,
			};

			const expiredAuthTokenValue = jwtSign(
				newPayload,
				Envs.API_AUTH_JWT_SECRET,
				{
					expiresIn: "-10s",
				},
			);

			const expiredRefreshTokenValue = jwtSign(
				newPayload,
				Envs.API_REFRESH_JWT_SECRET,
				{
					expiresIn: "-10s",
				},
			);

			const formattedCookieSat = formatSetHeaderCookie({
				name: authCookieSat.name,
				value: expiredAuthTokenValue,
			});

			const formattedCookieSrt = formatSetHeaderCookie({
				name: authCookieSrt.name,
				value: expiredRefreshTokenValue,
			});

			await awaitTimer(1100);

			const response = await request(server)
				.post("/sellers/validate-auth")
				.set("Cookie", [formattedCookieSat, formattedCookieSrt])
				.send();

			const { cookieSat, cookieSrt } = parseResponseSellerAuthCookies(response);

			expect(response.status).toBe(401);
			expect(response.body.error).toBe("Unauthorized");

			expect(cookieSat.name).toBeDefined();
			expect(cookieSat.value).toBe("");
			expect(cookieSat.httpOnly).toBe(true);
			expect(cookieSat.maxAge).toBe(0);
			expect(cookieSat.path).toBe("/");
			expect(cookieSat.sameSite).toBe("lax");

			expect(cookieSrt.name).toBeDefined();
			expect(cookieSrt.value).toBe("");
			expect(cookieSrt.httpOnly).toBe(true);
			expect(cookieSrt.path).toBe("/");
			expect(cookieSrt.sameSite).toBe("lax");
			expect(cookieSrt.maxAge).toBe(0);
		});
	});
	describe("POST /sellers/logout", () => {
		it("should logout and expire cookies(auth/refresh)", async () => {
			const response = await request(server).post("/sellers/logout").send();

			const { cookieSat, cookieSrt } = parseResponseSellerAuthCookies(response);

			expect(response.status).toBe(200);

			expect(cookieSat.name).toBeDefined();
			expect(cookieSat.value).toBe("");
			expect(cookieSat.httpOnly).toBe(true);
			expect(cookieSat.maxAge).toBe(0);
			expect(cookieSat.path).toBe("/");
			expect(cookieSat.sameSite).toBe("lax");

			expect(cookieSrt.name).toBeDefined();
			expect(cookieSrt.value).toBe("");
			expect(cookieSrt.httpOnly).toBe(true);
			expect(cookieSrt.path).toBe("/");
			expect(cookieSrt.sameSite).toBe("lax");
			expect(cookieSrt.maxAge).toBe(0);
		});
	});

	describe("POST /sellers/ask-reset-password", () => {
		beforeAll(async () => {
			await request(server).post("/sellers").send({
				name: "Ask Reset Password Seller",
				email: "askreset@example.com",
				password: "password123",
			});
		});

		it("should return success to send pt reset password email", async () => {
			const response = await request(server)
				.post("/sellers/ask-reset-password")
				.send({
					email: "askreset@example.com",
					language: "pt",
				});

			expect(sendEmailMock).toHaveBeenCalled();
			expect(response.status).toBe(200);
		});

		it("should return success to send en reset password email", async () => {
			const response = await request(server)
				.post("/sellers/ask-reset-password")
				.send({
					email: "askreset@example.com",
					language: "en",
				});

			expect(sendEmailMock).toHaveBeenCalled();
			expect(response.status).toBe(200);
		});

		it("should fail with invalid email format", async () => {
			const response = await request(server)
				.post("/sellers/ask-reset-password")
				.send({
					email: "askreset@@example.com",
					language: "en",
				});

			expect(response.status).toBe(400);
		});
	});

	// describe("PATCH /sellers/:id", () => {
	// 	let sellerId: string;

	// 	beforeAll(async () => {
	// 		// Create a seller for update tests
	// 		const response = await request(server)
	// 			.post("/sellers")
	// 			.send({
	// 				name: "Update Test Seller",
	// 				email: "update@example.com",
	// 				password: "password123",
	// 			});
	// 		sellerId = response.body.data.id;
	// 	});

	// 	it("should update seller name", async () => {
	// 		const response = await request(server)
	// 			.patch(`/sellers/${sellerId}`)
	// 			.send({
	// 				name: "Updated Name",
	// 			});

	// 		expect(response.status).toBe(200);
	// 		expect(response.body.data.name).toBe("Updated Name");
	// 		expect(response.body.data.email).toBe("update@example.com");
	// 	});

	// 	it("should update seller email", async () => {
	// 		const response = await request(server)
	// 			.patch(`/sellers/${sellerId}`)
	// 			.send({
	// 				email: "newemail@example.com",
	// 			});

	// 		expect(response.status).toBe(200);
	// 		expect(response.body.data.email).toBe("newemail@example.com");
	// 	});

	// 	it("should update both name and email", async () => {
	// 		const response = await request(server)
	// 			.patch(`/sellers/${sellerId}`)
	// 			.send({
	// 				name: "Another Name",
	// 				email: "another@example.com",
	// 			});

	// 		expect(response.status).toBe(200);
	// 		expect(response.body.data.name).toBe("Another Name");
	// 		expect(response.body.data.email).toBe("another@example.com");
	// 	});

	// 	it("should fail with invalid UUID", async () => {
	// 		const response = await request(server)
	// 			.patch("/sellers/invalid-uuid")
	// 			.send({
	// 				name: "Test",
	// 			});

	// 		expect(response.status).toBe(400);
	// 	});

	// 	it("should fail with non-existent seller ID", async () => {
	// 		const response = await request(server)
	// 			.patch("/sellers/550e8400-e29b-41d4-a716-446655440000")
	// 			.send({
	// 				name: "Test",
	// 			});

	// 		expect(response.status).toBe(404);
	// 	});

	// 	it("should fail when updating to duplicate email", async () => {
	// 		// Create another seller
	// 		await request(server).post("/sellers").send({
	// 			name: "Another Seller",
	// 			email: "existing@example.com",
	// 			password: "password123",
	// 		});

	// 		// Try to update with existing email
	// 		const response = await request(server)
	// 			.patch(`/sellers/${sellerId}`)
	// 			.send({
	// 				email: "existing@example.com",
	// 			});

	// 		expect(response.status).toBe(400);
	// 	});

	// 	it("should fail with invalid email format", async () => {
	// 		const response = await request(server)
	// 			.patch(`/sellers/${sellerId}`)
	// 			.send({
	// 				email: "invalid-email",
	// 			});

	// 		expect(response.status).toBe(400);
	// 	});
});
