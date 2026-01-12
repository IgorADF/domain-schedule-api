import type { Server } from "node:http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	createDefaultTestAgendaConfig,
	defaultAgendaConfig,
} from "./helpers/agenda.js";
import { runFinalTestConfigs, runInitTestConfigs } from "./helpers/config.js";
import { authTestSeller, createTestSeller } from "./helpers/seller.js";
import { setVitestSystemTime, useRealTimersVitest } from "./helpers/vitest.js";

let server: Server;

describe("Agenda Routes", () => {
	beforeAll(async () => {
		server = (await runInitTestConfigs()).server;
	});

	afterAll(async () => {
		await runFinalTestConfigs();
	});

	describe("POST /agendas", () => {
		const defaultSellerEmail1 = "postagenda1@example.com";
		const defaultSellerEmail2 = "postagenda2@example.com";

		beforeAll(async () => {
			await createTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await createTestSeller(server, {
				email: defaultSellerEmail2,
			});
		});

		it("should create a new agenda with valid data", async () => {
			const { formattedCookies: cookies } = await authTestSeller(server, {
				email: defaultSellerEmail1,
			});

			const response = await request(server)
				.post("/agendas")
				.set("Cookie", cookies)
				.send(defaultAgendaConfig);

			expect(response.status).toBe(200);
			expect(response.body.data.id).toBeDefined();
		});

		it("should return ENTITY_ALREADY_EXISTerror when creating a duplicate agenda", async () => {
			const { formattedCookies: cookies } = await authTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await request(server)
				.post("/agendas")
				.set("Cookie", cookies)
				.send(defaultAgendaConfig);

			const response = await request(server)
				.post("/agendas")
				.set("Cookie", cookies)
				.send(defaultAgendaConfig);

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("ENTITY_ALREADY_EXIST");
		});
	});

	describe("GET /agendas", () => {
		const defaultSellerEmail1 = "getagenda1@example.com";
		const defaultSellerEmail2 = "getagenda2@example.com";

		beforeAll(async () => {
			await createTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await createTestSeller(server, {
				email: defaultSellerEmail2,
			});
		});

		it("should return seller agendaConfig data", async () => {
			const { formattedCookies: cookies } = await authTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await createDefaultTestAgendaConfig(server, cookies);

			const response = await request(server)
				.get("/agendas")
				.set("Cookie", cookies);

			expect(response.status).toBe(200);
			expect(response.body.data).toBeDefined();
		});

		it("should return error ENTITY_ALREADY_EXIST if seller has no agenda configured", async () => {
			const { formattedCookies: cookies } = await authTestSeller(server, {
				email: defaultSellerEmail2,
			});

			const response = await request(server)
				.get("/agendas")
				.set("Cookie", cookies);

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("ENTITY_NOT_FOUND");
		});
	});

	describe("GET /agendas/available-slots", () => {
		const defaultSellerEmail1 = "getagendaavailableslots1@example.com";
		const defaultSellerEmail2 = "getagendaavailableslots2@example.com";

		beforeAll(async () => {
			await createTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await createTestSeller(server, {
				email: defaultSellerEmail2,
			});
		});

		it("should return available slots", async () => {
			setVitestSystemTime(new Date(2026, 0, 1));

			const { formattedCookies: cookies } = await authTestSeller(server, {
				email: defaultSellerEmail1,
			});

			const agendaConfigId = await createDefaultTestAgendaConfig(
				server,
				cookies,
			);

			const response = await request(server)
				.get("/agendas/available-slots")
				.set("Cookie", cookies)
				.query({
					initialDate: "2026-01-05",
					finalDate: "2026-01-12",
					agendaConfigId,
				});

			expect(response.status).toBe(200);

			const daysOfWeek = response.body.data;
			expect(daysOfWeek[0].slots.length).toBe(5);
			expect(daysOfWeek[1].slots.length).toBe(8);
			expect(daysOfWeek[2].slots.length).toBe(10);
			expect(daysOfWeek[3].slots.length).toBe(2);
			expect(daysOfWeek[4].slots.length).toBe(7);
			expect(daysOfWeek[5].slots.length).toBe(4);
			expect(daysOfWeek[6].slots.length).toBe(0);
			expect(daysOfWeek[7].slots.length).toBe(5); //repeat first day

			useRealTimersVitest();
		});
	});
});
