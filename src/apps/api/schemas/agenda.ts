import z from "zod";
import { AgendaConfigSchema } from "@/domain/entities/agenda-config.js";
import { AgendaDayOfWeekSchema } from "@/domain/entities/agenda-day-of-week.js";
import { AgendaPeriodSchema } from "@/domain/entities/agenda-periods.js";
import { DayObj } from "@/domain/shared/value-objects/day.js";
import { TimeObj } from "@/domain/shared/value-objects/time.js";

export const PostAgendaResponseSchema = z.object({
	data: AgendaConfigSchema,
});

export const GetAgendaResponseSchema = z.object({
	data: z.object({
		agendaConfig: AgendaConfigSchema,
		agendaDaysOfWeek: z.array(
			z.object({
				dayOfWeek: AgendaDayOfWeekSchema,
				periods: z.array(AgendaPeriodSchema),
			}),
		),
	}),
});

export const GetAgendaAvailableSlotsResponseSchema = z.object({
	data: z.array(
		z.object({
			day: DayObj,
			slots: z.array(
				z.object({
					startTime: TimeObj,
					endTime: TimeObj,
				}),
			),
		}),
	),
});
