import {
	OverwriteDaySchema,
	type OverwriteDayType,
} from "@domain/entities/overwrite-day.js";
import {
	dayToISOString,
	isoStringToDay,
} from "@/domain/shared/value-objects/day.js";
import type OverwriteDayModel from "../database/models/overwrite-day.js";
import type { OverwriteDayModelType } from "../database/models/overwrite-day.js";

export function toModel(overwriteDay: OverwriteDayType): OverwriteDayModelType {
	const { year, month, day } = overwriteDay.day;

	const dayString = dayToISOString({ year, month, day });

	return {
		id: overwriteDay.id,
		agendaConfigId: overwriteDay.agendaConfigId,
		day: dayString,
		cancelAllDay: overwriteDay.cancelAllDay,
		creationDate: overwriteDay.creationDate,
		updateDate: overwriteDay.updateDate,
	};
}

export function toEntity(_overwriteDay: OverwriteDayModel): OverwriteDayType {
	const overwriteDay = _overwriteDay.toJSON();

	const { year, month, day } = isoStringToDay(overwriteDay.day);

	const map: OverwriteDayType = {
		id: overwriteDay.id,
		agendaConfigId: overwriteDay.agendaConfigId,
		day: {
			year,
			month,
			day,
		},
		cancelAllDay: overwriteDay.cancelAllDay,
		creationDate: overwriteDay.creationDate,
		updateDate: overwriteDay.updateDate,
	};

	const entity = OverwriteDaySchema.parse(map);
	return entity;
}
