import {
	AgendaDayOfWeekSchema,
	type AgendaDayOfWeekType,
} from "@domain/entities/agenda-day-of-week.js";
import type {
	AgendaDayOfWeekPrisma,
	CreateAgendaDayOfWeekPrisma,
} from "../types.js";

export function toModel(
	dayOfWeek: AgendaDayOfWeekType,
): CreateAgendaDayOfWeekPrisma {
	return {
		id: dayOfWeek.id,
		agendaConfigId: dayOfWeek.agendaConfigId,
		dayOfWeek: dayOfWeek.dayOfWeek,
		cancelAllDay: dayOfWeek.cancelAllDay,
		creationDate: dayOfWeek.creationDate,
		updateDate: dayOfWeek.updateDate,
	};
}

export function toEntity(
	dayOfWeek: AgendaDayOfWeekPrisma,
): AgendaDayOfWeekType {
	const map: AgendaDayOfWeekType = {
		id: dayOfWeek.id,
		agendaConfigId: dayOfWeek.agendaConfigId,
		dayOfWeek: dayOfWeek.dayOfWeek,
		cancelAllDay: dayOfWeek.cancelAllDay,
		creationDate: dayOfWeek.creationDate,
		updateDate: dayOfWeek.updateDate,
	};

	const entity = AgendaDayOfWeekSchema.parse(map);
	return entity;
}
