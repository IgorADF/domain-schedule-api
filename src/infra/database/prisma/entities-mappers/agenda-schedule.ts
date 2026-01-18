import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "@domain/entities/agenda-schedule.js";
import { getDayFromDate, toJSDate } from "@/domain/shared/value-objects/day.js";
import {
	fromFormattedTimeString,
	toFormattedTimeString,
} from "@/domain/shared/value-objects/time.js";
import type {
	AgendaSchedulePrisma,
	CreateAgendaSchedulePrisma,
} from "../types.js";

export function toModel(
	schedule: AgendaScheduleType,
): CreateAgendaSchedulePrisma {
	const startTime = toFormattedTimeString(schedule.startTime);
	const endTime = toFormattedTimeString(schedule.endTime);
	const dayDate = toJSDate(schedule.day);

	return {
		id: schedule.id,
		agendaConfigId: schedule.agendaConfigId,
		contactName: schedule.contactName,
		contactPhoneNumber: schedule.contactPhoneNumber,
		day: dayDate,
		startTime,
		endTime,
		creationDate: schedule.creationDate,
		updateDate: schedule.updateDate,
	};
}

export function toEntity(schedule: AgendaSchedulePrisma): AgendaScheduleType {
	const { hour: startHour, minute: startMinute } = fromFormattedTimeString(
		schedule.startTime,
	);
	const { hour: endHour, minute: endMinute } = fromFormattedTimeString(
		schedule.endTime,
	);

	const { year, month, day } = getDayFromDate(schedule.day);

	const map: AgendaScheduleType = {
		id: schedule.id,
		agendaConfigId: schedule.agendaConfigId,
		contactName: schedule.contactName,
		contactPhoneNumber: schedule.contactPhoneNumber,
		day: {
			year,
			month,
			day,
		},
		startTime: {
			hour: startHour,
			minute: startMinute,
		},
		endTime: {
			hour: endHour,
			minute: endMinute,
		},
		creationDate: schedule.creationDate,
		updateDate: schedule.updateDate,
	};

	const entity = AgendaScheduleSchema.parse(map);
	return entity;
}
