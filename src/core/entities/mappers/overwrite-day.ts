import {
	OverwriteDaySchema,
	type OverwriteDayType,
} from "@domain/entities/overwrite-day.js";
import { OverwriteDayModel } from "../../database/models/overwrite-day.js";

export function toModel(overwriteDay: OverwriteDayType): OverwriteDayModel {
	const { year, month, day } = overwriteDay.day;

	return new OverwriteDayModel({
		id: overwriteDay.id,
		agendaId: overwriteDay.agendaId,
		day: new Date(year, month - 1, day),
		cancelAllDay: overwriteDay.cancelAllDay,
	});
}

export function toEntity(_overwriteDay: OverwriteDayModel): OverwriteDayType {
	const overwriteDay = _overwriteDay.toJSON();

	const map: OverwriteDayType = {
		id: overwriteDay.id,
		agendaId: overwriteDay.agendaId,
		day: {
			year: overwriteDay.day.getFullYear(),
			month: overwriteDay.day.getMonth() + 1,
			day: overwriteDay.day.getDate(),
		},
		cancelAllDay: overwriteDay.cancelAllDay,
		createdAt: overwriteDay.createdAt,
		updatedAt: overwriteDay.updatedAt,
	};

	const entity = OverwriteDaySchema.parse(map);
	return entity;
}
