import {
	OverwriteDaySchema,
	type OverwriteDayType,
} from "@domain/entities/overwrite-day.js";
import { getDayFromDate, toJSDate } from "@/domain/shared/value-objects/day.js";
import type { CreateOverwriteDayPrisma, OverwriteDayPrisma } from "../types.js";

export function toModel(
	overwriteDay: OverwriteDayType,
): CreateOverwriteDayPrisma {
	const dayDate = toJSDate(overwriteDay.day);

	return {
		id: overwriteDay.id,
		agendaConfigId: overwriteDay.agendaConfigId,
		day: dayDate,
		cancelAllDay: overwriteDay.cancelAllDay,
		creationDate: overwriteDay.creationDate,
		updateDate: overwriteDay.updateDate,
	};
}

export function toEntity(overwriteDay: OverwriteDayPrisma): OverwriteDayType {
	const { year, month, day } = getDayFromDate(overwriteDay.day);

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
