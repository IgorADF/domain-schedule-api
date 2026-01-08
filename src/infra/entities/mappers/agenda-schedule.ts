import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "@domain/entities/agenda-schedule.js";
import {
	dayToISOString,
	isoStringToDay,
} from "@/domain/shared/value-objects/day.js";
import {
	fromFormattedTimeString,
	toFormattedTimeString,
} from "@/domain/shared/value-objects/time.js";
import type AgendaScheduleModel from "../../database/sequelize/models/agenda-schedule.js";
import type { AgendaScheduleModelType } from "../../database/sequelize/models/agenda-schedule.js";

export function toModel(schedule: AgendaScheduleType): AgendaScheduleModelType {
	const startTime = toFormattedTimeString(schedule.startTime);
	const endTime = toFormattedTimeString(schedule.endTime);

	const { year, month, day } = schedule.day;
	const dayString = dayToISOString({ year, month, day });

	return {
		id: schedule.id,
		agendaConfigId: schedule.agendaConfigId,
		contactName: schedule.contactName,
		contactPhoneNumber: schedule.contactPhoneNumber,
		day: dayString,
		startTime,
		endTime,
		creationDate: schedule.creationDate,
		updateDate: schedule.updateDate,
	};
}

export function toEntity(_schedule: AgendaScheduleModel): AgendaScheduleType {
	const schedule = _schedule.toJSON();

	const { hour: startHour, minute: startMinute } = fromFormattedTimeString(
		schedule.startTime,
	);
	const { hour: endHour, minute: endMinute } = fromFormattedTimeString(
		schedule.endTime,
	);

	const { year, month, day } = isoStringToDay(schedule.day);

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
