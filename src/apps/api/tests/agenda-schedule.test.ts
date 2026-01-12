import type { Server } from "node:http";
import { DateTime } from "luxon";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { runFinalTestConfigs, runInitTestConfigs } from "./helpers/_config.js";
import { defaultAgendaConfig } from "./helpers/agenda.js";
import { toDateFormat, toDayObj } from "./helpers/dates.js";
import {
	createAndAuthTestSeller,
	setSellerFullInitialTestData,
} from "./helpers/seller.js";
import { setVitestSystemTime, useRealTimersVitest } from "./helpers/vitest.js";

let server: Server;

describe("Agenda Schedule Routes", () => {
	beforeAll(async () => {
		server = (await runInitTestConfigs()).server;
	});

	afterAll(async () => {
		await runFinalTestConfigs();
	});

	describe("POST /agenda-schedules", () => {
		const systemDate = new Date(2026, 0, 12);

		beforeAll(async () => {
			setVitestSystemTime(systemDate);
		});

		afterAll(() => {
			useRealTimersVitest();
		});

		it("should create a new schedule with valid data", async () => {
			const { agendaConfigId } = await setSellerFullInitialTestData(server);

			const date = DateTime.now().plus({ days: 10 }).toJSDate();

			const response = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			expect(response.status).toBe(200);
			expect(response.body.data).toBeDefined();
			expect(response.body.data.agendaConfigId).toBe(agendaConfigId);
		});

		it("should return SLOT_NOT_AVAILABLE when creating a slot that do not exist", async () => {
			const { agendaConfigId } = await setSellerFullInitialTestData(server);

			const date = DateTime.now().plus({ days: 10 }).toJSDate();

			const response = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 1, minute: 0 },
					endTime: { hour: 22, minute: 30 },
				});

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("SLOT_NOT_AVAILABLE");
		});

		it("should return SLOT_NOT_AVAILABLE when creating a duplicate schedule", async () => {
			const { agendaConfigId } = await setSellerFullInitialTestData(server);

			const date = DateTime.now().plus({ days: 10 }).toJSDate();

			await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			const response = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			expect(response.status).toBe(409);
			expect(response.body.error).toBe("SLOT_NOT_AVAILABLE");
		});

		it("should allow sequential schedules", async () => {
			const completeAgendaData = structuredClone(defaultAgendaConfig);

			const dayOfWeekIndexToOverride = 3;
			const periodToOverride = 0;

			completeAgendaData.daysOfWeek[dayOfWeekIndexToOverride].periods[
				periodToOverride
			].minutesOfInterval = null;

			const { agendaConfigId } = await setSellerFullInitialTestData(
				server,
				completeAgendaData,
			);

			const date = DateTime.now().plus({ days: 10 }).toJSDate();

			const response1 = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			const response2 = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 9, minute: 30 },
					endTime: { hour: 11, minute: 0 },
				});

			expect(response1.status).toBe(200);
			expect(response2.status).toBe(200);
		});

		it("should return SCHEDULE_TOO_SOON when creating a schedule too soon", async () => {
			const completeAgendaData = structuredClone(defaultAgendaConfig);

			completeAgendaData.agendaConfig.minHoursOfAdvancedNotice = 500;

			const { agendaConfigId } = await setSellerFullInitialTestData(
				server,
				completeAgendaData,
			);

			const date = DateTime.fromJSDate(systemDate).plus({ days: 1 }).toJSDate();

			const response = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("SCHEDULE_TOO_SOON");
		});

		it("should return SCHEDULE_TOO_FAR_AHEAD when creating a schedule too far ahead", async () => {
			const completeAgendaData = structuredClone(defaultAgendaConfig);

			completeAgendaData.agendaConfig.maxDaysOfAdvancedNotice = 4;

			const { agendaConfigId } = await setSellerFullInitialTestData(
				server,
				completeAgendaData,
			);

			const date = DateTime.fromJSDate(systemDate).plus({ days: 7 }).toJSDate();

			const response = await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			expect(response.status).toBe(400);
			expect(response.body.error).toBe("SCHEDULE_TOO_FAR_AHEAD");
		});
	});

	describe("GET /agenda-schedules", () => {
		const systemDate = new Date(2026, 0, 12);

		beforeAll(async () => {
			setVitestSystemTime(systemDate);
		});

		afterAll(() => {
			useRealTimersVitest();
		});

		it("should list schedules grouped by date for authenticated seller", async () => {
			const { agendaConfigId, authData } =
				await setSellerFullInitialTestData(server);

			const { formattedCookies: cookies } = authData;

			const date = DateTime.now().plus({ days: 10 }).toJSDate();

			await request(server)
				.post("/agenda-schedules")
				.send({
					agendaConfigId,
					contactName: "Test Contact",
					contactPhoneNumber: "+5511999999999",
					day: toDayObj(date),
					startTime: { hour: 8, minute: 0 },
					endTime: { hour: 9, minute: 30 },
				});

			const response = await request(server)
				.get("/agenda-schedules")
				.set("Cookie", cookies)
				.query({
					initialDate: toDateFormat(date),
					finalDate: toDateFormat(date),
				});

			expect(response.status).toBe(200);
			expect(response.body.data).toBeDefined();
			expect(response.body.data.groupedSchedules).toBeDefined();
		});

		it("should return ENTITY_NOT_FOUND when seller has no agenda configured", async () => {
			const { formattedCookies: cookies } =
				await createAndAuthTestSeller(server);

			const response = await request(server)
				.get("/agenda-schedules")
				.set("Cookie", cookies)
				.query({
					initialDate: "2026-01-05",
					finalDate: "2026-01-10",
				});

			expect(response.status).toBe(404);
			expect(response.body.error).toBe("ENTITY_NOT_FOUND");
		});
	});
});
