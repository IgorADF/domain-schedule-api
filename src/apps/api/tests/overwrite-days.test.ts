import type { Server } from "node:http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runFinalTestConfigs, runInitTestConfigs } from "./helpers/_config.js";
import { createDefaultTestAgendaConfig } from "./helpers/agenda.js";
import { toDayObj } from "./helpers/dates.js";
import { createAndAuthTestSeller } from "./helpers/seller.js";

let server: Server;

describe("Overwrite Days Routes", () => {
	beforeAll(async () => {
		server = (await runInitTestConfigs()).server;
	});

	afterAll(async () => {
		await runFinalTestConfigs();
	});

	describe("POST /overwrite-days", () => {
		it("should create overwrite days for authenticated seller", async () => {
			const { formattedCookies: cookies } =
				await createAndAuthTestSeller(server);

			await createDefaultTestAgendaConfig(server, cookies);

			const overwriteDate = new Date();
			overwriteDate.setDate(overwriteDate.getDate() + 5);

			const response = await request(server)
				.post("/overwrite-days")
				.set("Cookie", cookies)
				.send({
					overwriteDays: [
						{
							day: toDayObj(overwriteDate),
							cancelAllDay: true,
						},
					],
				});

			expect(response.status).toBe(200);
			expect(response.body.data).toBeDefined();
			expect(Array.isArray(response.body.data)).toBe(true);
		});

		it("should return ENTITY_NOT_FOUND when agendaConfig is not found to authenticated seller", async () => {
			const { formattedCookies: cookies } =
				await createAndAuthTestSeller(server);

			const overwriteDate = new Date();
			overwriteDate.setDate(overwriteDate.getDate() + 5);

			const response = await request(server)
				.post("/overwrite-days")
				.set("Cookie", cookies)
				.send({
					overwriteDays: [
						{
							day: toDayObj(overwriteDate),
							cancelAllDay: true,
						},
					],
				});

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("ENTITY_NOT_FOUND");
		});
	});
});
