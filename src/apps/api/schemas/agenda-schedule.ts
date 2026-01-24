import z from "zod";
import { AgendaScheduleSchema } from "@/domain/entities/agenda-schedule.js";
import { DayObj } from "@/domain/shared/value-objects/day.js";

export const GetAgendaSchedulesResponseSchema = z.object({
	data: z.object({
		groupedSchedules: z.array(
			z.object({
				date: DayObj,
				schedules: z.array(AgendaScheduleSchema),
			}),
		),
	}),
});

export const CreateAgendaSchedulesResponseSchema = z.object({
	data: AgendaScheduleSchema,
});

export const DeleteAgendaScheduleResponseSchema = z.null();
