import type { Server } from "node:http";
import request from "supertest";
import type { CreateCompleteAgendaType } from "@/domain/use-cases/create-complete-agenda.js";

export const defaultAgendaConfig: Omit<CreateCompleteAgendaType, "sellerId"> = {
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

export type CreationCompleteAgendaDataType = typeof defaultAgendaConfig;

export async function createDefaultTestAgendaConfig(
	server: Server,
	cookies: string[],
	creationAgendaData?: typeof defaultAgendaConfig,
) {
	const response = await request(server)
		.post("/agendas")
		.set("Cookie", cookies)
		.send(creationAgendaData ?? defaultAgendaConfig);

	return response.body.data.id;
}
