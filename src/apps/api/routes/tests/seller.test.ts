import type { Server } from "node:http";
import cookie from "cookie";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
	authTokenData,
	refreshTokenData,
} from "../../handlers/auth/tokens-config.js";
import { runFinalTestConfigs, runInitTestConfigs } from "./_config.js";

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

			const cookieSatString = response?.headers?.["set-cookie"]?.[0];
			const cookieSrtString = response?.headers?.["set-cookie"]?.[1];
			const cookieSat = cookie.parseSetCookie(cookieSatString);
			const cookieSrt = cookie.parseSetCookie(cookieSrtString);

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

	describe("POST /sellers/logout", () => {
		it("should logout and expire cookies(auth/refresh)", async () => {
			const response = await request(server).post("/sellers/logout").send();

			const cookieSatString = response?.headers?.["set-cookie"]?.[0];
			const cookieSrtString = response?.headers?.["set-cookie"]?.[1];
			const cookieSat = cookie.parseSetCookie(cookieSatString);
			const cookieSrt = cookie.parseSetCookie(cookieSrtString);

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
