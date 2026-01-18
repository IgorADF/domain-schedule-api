import {
	AgendaPeriodSchema,
	type AgendaPeriodType,
} from "@domain/entities/agenda-periods.js";
import {
	fromFormattedTimeString,
	toFormattedTimeString,
} from "@/domain/shared/value-objects/time.js";
import type {
	AgendaPeriodsPrisma,
	CreateAgendaPeriodsPrisma,
} from "../types.js";

export function toModel(period: AgendaPeriodType): CreateAgendaPeriodsPrisma {
	const startTime = toFormattedTimeString(period.startTime);
	const endTime = toFormattedTimeString(period.endTime);

	return {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId ?? null,
		overwriteDayId: period.overwriteDayId ?? null,
		startTime,
		endTime,
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval ?? null,
		order: period.order,
		creationDate: period.creationDate,
		updateDate: period.updateDate,
	};
}

export function toEntity(period: AgendaPeriodsPrisma): AgendaPeriodType {
	const { hour: startHour, minute: startMinute } = fromFormattedTimeString(
		period.startTime,
	);
	const { hour: endHour, minute: endMinute } = fromFormattedTimeString(
		period.endTime,
	);

	const map: AgendaPeriodType = {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId ?? null,
		overwriteDayId: period.overwriteDayId ?? null,
		startTime: {
			hour: startHour,
			minute: startMinute,
		},
		endTime: {
			hour: endHour,
			minute: endMinute,
		},
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval ?? null,
		order: period.order,
		creationDate: period.creationDate,
		updateDate: period.updateDate,
	};

	const entity = AgendaPeriodSchema.parse(map);
	return entity;
}
