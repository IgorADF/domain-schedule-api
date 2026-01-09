import z from "zod";
import { AgendaConfigSchema } from "@/domain/entities/agenda-config.js";
import { AgendaDayOfWeekSchema } from "@/domain/entities/agenda-day-of-week.js";
import { AgendaEventSchema } from "@/domain/entities/agenda-event.js";
import { AgendaPeriodSchema } from "@/domain/entities/agenda-periods.js";
import { AgendaScheduleSchema } from "@/domain/entities/agenda-schedule.js";
import { OverwriteDaySchema } from "@/domain/entities/overwrite-day.js";
import { SellerSchema } from "@/domain/entities/seller.js";
import { DayObj } from "@/domain/shared/value-objects/day.js";
import { TimeObj } from "@/domain/shared/value-objects/time.js";
import { ErrorSchema } from "../../handlers/errors/schema.js";

export const DefaultSuccessSchema = z.object({ success: z.boolean() });
export const DefaultErrorSchema = ErrorSchema;

/* Seller */
export const CreateSellerResponseSchema = z.object({
	data: SellerSchema,
});

/* Overwrite Days */
export const CreateOverwriteDaysResponseSchema = z.object({
	data: z.array(OverwriteDaySchema),
});

/* Agenda */
export const NoAgendaConfiguredErrorSchema = DefaultErrorSchema.describe(
	"Seller has not agenda configured yet (ENTITY_NOT_FOUND)",
);

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

/* Agenda Schedule */

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

/* Agenda Event */

export const ListSellerAgendaEventsResponseSchema = z.object({
	data: z.object({
		items: z.array(AgendaEventSchema),
		total: z.number().int().min(0),
		page: z.number().int().min(1),
		pageSize: z.number().int().min(1),
		totalPages: z.number().int().min(0),
	}),
});
