import {
	OverwriteDaySchema,
	type OverwriteDayType,
} from "@domain/entities/overwrite-day.js";
import type OverwriteDayModel from "../../database/models/overwrite-day.js";
import type { OverwriteDayModelType } from "../../database/models/overwrite-day.js";

export function toModel(overwriteDay: OverwriteDayType): OverwriteDayModelType {
	const { year, month, day } = overwriteDay.day;

	return {
		id: overwriteDay.id,
		agendaId: overwriteDay.agendaId,
		day: new Date(year, month - 1, day),
		cancelAllDay: overwriteDay.cancelAllDay,
		creationDate: overwriteDay.creationDate,
		updateDate: overwriteDay.updateDate,
	};
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
		creationDate: overwriteDay.creationDate,
		updateDate: overwriteDay.updateDate,
	};

	const entity = OverwriteDaySchema.parse(map);
	return entity;
}
