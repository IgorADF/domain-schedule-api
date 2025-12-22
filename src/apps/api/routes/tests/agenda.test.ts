import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { fastifyInstance } from "../../server-config.js";

describe("Agenda Routes", () => {
	let sellerId: string;

	beforeAll(async () => {
		await fastifyInstance.ready();

		// Create a seller for agenda tests
		const sellerResponse = await request(fastifyInstance.server)
			.post("/sellers")
			.send({
				name: "Agenda Test Seller",
				email: "agenda-seller@example.com",
				password: "password123",
			});
		sellerId = sellerResponse.body.data.id;
	});

	afterAll(async () => {
		await fastifyInstance.close();
	});

	describe("POST /agendas", () => {
		it("should create a complete agenda with valid data", async () => {
			const agendaData = {
				sellerId: sellerId,
				maxDaysOfAdvancedNotice: 30,
				minHoursOfAdvancedNotice: 2,
				timezone: "America/Sao_Paulo",
				daysOfWeek: [
					{
						dayOfWeek: 1,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 2,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 3,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 4,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 5,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 6,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
					{
						dayOfWeek: 7,
						periods: [
							{
								startTime: "08:00",
								endTime: "09:00",
								slotDurationInMinutes: 30,
								slotOrder: 1,
							},
							{
								startTime: "09:00",
								endTime: "10:00",
								slotDurationInMinutes: 30,
								slotOrder: 2,
							},
							{
								startTime: "10:00",
								endTime: "11:00",
								slotDurationInMinutes: 30,
								slotOrder: 3,
							},
							{
								startTime: "11:00",
								endTime: "12:00",
								slotDurationInMinutes: 30,
								slotOrder: 4,
							},
							{
								startTime: "13:00",
								endTime: "14:00",
								slotDurationInMinutes: 30,
								slotOrder: 5,
							},
							{
								startTime: "14:00",
								endTime: "15:00",
								slotDurationInMinutes: 30,
								slotOrder: 6,
							},
							{
								startTime: "15:00",
								endTime: "16:00",
								slotDurationInMinutes: 30,
								slotOrder: 7,
							},
						],
					},
				],
			};

			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send(agendaData);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ success: true });
		});

		it("should fail with missing sellerId", async () => {
			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: [],
				});

			expect(response.status).toBe(400);
		});

		it("should fail with invalid sellerId format", async () => {
			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: "invalid-uuid",
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: [],
				});

			expect(response.status).toBe(400);
		});

		it("should fail with maxDaysOfAdvancedNotice exceeding limit", async () => {
			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: sellerId,
					maxDaysOfAdvancedNotice: 800,
					timezone: "America/Sao_Paulo",
					daysOfWeek: [],
				});

			expect(response.status).toBe(400);
		});

		it("should fail with invalid number of daysOfWeek", async () => {
			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: sellerId,
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: [
						{
							dayOfWeek: 1,
							periods: [],
						},
					],
				});

			expect(response.status).toBe(400);
		});

		it("should fail with invalid dayOfWeek value", async () => {
			const invalidDays = [];
			for (let i = 1; i <= 7; i++) {
				invalidDays.push({
					dayOfWeek: i === 1 ? 8 : i,
					periods: Array(7).fill({
						startTime: "08:00",
						endTime: "09:00",
						slotDurationInMinutes: 30,
						slotOrder: 1,
					}),
				});
			}

			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: sellerId,
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: invalidDays,
				});

			expect(response.status).toBe(400);
		});

		it("should fail with incorrect number of periods per day", async () => {
			const daysWithWrongPeriods = [];
			for (let i = 1; i <= 7; i++) {
				daysWithWrongPeriods.push({
					dayOfWeek: i,
					periods: [
						{
							startTime: "08:00",
							endTime: "09:00",
							slotDurationInMinutes: 30,
							slotOrder: 1,
						},
					],
				});
			}

			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: sellerId,
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: daysWithWrongPeriods,
				});

			expect(response.status).toBe(400);
		});

		it("should fail with invalid time format", async () => {
			const daysWithInvalidTime = [];
			for (let i = 1; i <= 7; i++) {
				daysWithInvalidTime.push({
					dayOfWeek: i,
					periods: [
						{
							startTime: "invalid-time",
							endTime: "09:00",
							slotDurationInMinutes: 30,
							slotOrder: 1,
						},
						{
							startTime: "09:00",
							endTime: "10:00",
							slotDurationInMinutes: 30,
							slotOrder: 2,
						},
						{
							startTime: "10:00",
							endTime: "11:00",
							slotDurationInMinutes: 30,
							slotOrder: 3,
						},
						{
							startTime: "11:00",
							endTime: "12:00",
							slotDurationInMinutes: 30,
							slotOrder: 4,
						},
						{
							startTime: "13:00",
							endTime: "14:00",
							slotDurationInMinutes: 30,
							slotOrder: 5,
						},
						{
							startTime: "14:00",
							endTime: "15:00",
							slotDurationInMinutes: 30,
							slotOrder: 6,
						},
						{
							startTime: "15:00",
							endTime: "16:00",
							slotDurationInMinutes: 30,
							slotOrder: 7,
						},
					],
				});
			}

			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send({
					sellerId: sellerId,
					maxDaysOfAdvancedNotice: 30,
					timezone: "America/Sao_Paulo",
					daysOfWeek: daysWithInvalidTime,
				});

			expect(response.status).toBe(400);
		});

		it("should accept agenda without minHoursOfAdvancedNotice", async () => {
			const agendaData = {
				sellerId: sellerId,
				maxDaysOfAdvancedNotice: 15,
				timezone: "America/New_York",
				daysOfWeek: Array(7)
					.fill(null)
					.map((_, index) => ({
						dayOfWeek: index + 1,
						periods: Array(7)
							.fill(null)
							.map((_, pIndex) => ({
								startTime: `0${8 + pIndex}:00`.slice(-5),
								endTime: `0${9 + pIndex}:00`.slice(-5),
								slotDurationInMinutes: 60,
								slotOrder: pIndex + 1,
							})),
					})),
			};

			const response = await request(fastifyInstance.server)
				.post("/agendas")
				.send(agendaData);

			expect(response.status).toBe(200);
			expect(response.body).toEqual({ success: true });
		});
	});
});
