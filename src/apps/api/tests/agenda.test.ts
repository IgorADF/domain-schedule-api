import type { Server } from "node:http";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runFinalTestConfigs, runInitTestConfigs } from "./helpers/config.js";
import {
	authDefaultTestSeller,
	createDefaultTestSeller,
} from "./helpers/seller.js";

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
			await createDefaultTestSeller(server, {
				email: defaultSellerEmail1,
			});

			await createDefaultTestSeller(server, {
				email: defaultSellerEmail2,
			});
		});

		it("should create a new agenda with valid data", async () => {
			const { formattedCookies: cookies } = await authDefaultTestSeller(
				server,
				{
					email: defaultSellerEmail1,
				},
			);

			const body = {
				agendaConfig: {
					maxDaysOfAdvancedNotice: 100,
					minHoursOfAdvancedNotice: 24,
					timezone: "America/Sao_Paulo",
				},
				daysOfWeek: [
					{
						dayOfWeek: {
							dayOfWeek: 1,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 9, minute: 0 },
								endTime: { hour: 12, minute: 0 },
								minutesOfService: 60,
								minutesOfInterval: 15,
							},
							{
								startTime: { hour: 14, minute: 0 },
								endTime: { hour: 18, minute: 0 },
								minutesOfService: 60,
								minutesOfInterval: 15,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 2,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 9, minute: 0 },
								endTime: { hour: 17, minute: 0 },
								minutesOfService: 45,
								minutesOfInterval: 10,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 3,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 10, minute: 0 },
								endTime: { hour: 16, minute: 0 },
								minutesOfService: 30,
								minutesOfInterval: 5,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 4,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 8, minute: 0 },
								endTime: { hour: 12, minute: 0 },
								minutesOfService: 90,
								minutesOfInterval: 20,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 5,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 9, minute: 30 },
								endTime: { hour: 18, minute: 30 },
								minutesOfService: 60,
								minutesOfInterval: 15,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 6,
							cancelAllDay: false,
						},
						periods: [
							{
								startTime: { hour: 10, minute: 0 },
								endTime: { hour: 14, minute: 0 },
								minutesOfService: 45,
								minutesOfInterval: 10,
							},
						],
					},
					{
						dayOfWeek: {
							dayOfWeek: 7,
							cancelAllDay: true,
						},
						periods: [],
					},
				],
			};

			const response = await request(server)
				.post("/agendas")
				.set("Cookie", cookies)
				.send(body);

			expect(response.status).toBe(200);
			expect(response.body.success).toBe(true);
		});
	});
});
