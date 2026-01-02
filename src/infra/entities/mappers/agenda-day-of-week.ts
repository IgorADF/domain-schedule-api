import {
	AgendaDayOfWeekSchema,
	type AgendaDayOfWeekType,
} from "@domain/entities/agenda-day-of-week.js";
import type AgendaDayOfWeekModel from "../../database/models/agenda-day-of-week.js";
import type { AgendaDayOfWeekModelType } from "../../database/models/agenda-day-of-week.js";

export function toModel(
	dayOfWeek: AgendaDayOfWeekType,
): AgendaDayOfWeekModelType {
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
	_dayOfWeek: AgendaDayOfWeekModel,
): AgendaDayOfWeekType {
	const dayOfWeek = _dayOfWeek.toJSON();

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
