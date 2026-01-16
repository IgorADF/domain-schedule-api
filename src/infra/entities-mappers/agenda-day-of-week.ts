import {
	AgendaDayOfWeekSchema,
	type AgendaDayOfWeekType,
} from "@domain/entities/agenda-day-of-week.js";
import type {
	InsertAgendaDayOfWeek,
	SelectAgendaDayOfWeek,
} from "../database/types.js";

export function toModel(dayOfWeek: AgendaDayOfWeekType): InsertAgendaDayOfWeek {
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
	dayOfWeek: SelectAgendaDayOfWeek,
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
