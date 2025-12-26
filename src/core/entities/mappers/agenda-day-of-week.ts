import {
	AgendaDayOfWeekSchema,
	type AgendaDayOfWeekType,
} from "@domain/entities/agenda-day-of-week.js";
import { AgendaDayOfWeekModel } from "../../database/models/agenda-day-of-week.js";

export function toModel(dayOfWeek: AgendaDayOfWeekType): AgendaDayOfWeekModel {
	return new AgendaDayOfWeekModel({
		id: dayOfWeek.id,
		agendaConfigId: dayOfWeek.agendaConfigId,
		dayOfWeek: dayOfWeek.dayOfWeek,
		cancelAllDay: dayOfWeek.cancelAllDay,
		createdAt: dayOfWeek.createdAt,
		updatedAt: dayOfWeek.updatedAt,
	});
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
		createdAt: dayOfWeek.createdAt,
		updatedAt: dayOfWeek.updatedAt,
	};

	const entity = AgendaDayOfWeekSchema.parse(map);
	return entity;
}
