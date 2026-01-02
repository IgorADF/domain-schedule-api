import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "@domain/entities/agenda-schedule.js";
import type AgendaScheduleModel from "../../database/models/agenda-schedule.js";
import type { AgendaScheduleModelType } from "../../database/models/agenda-schedule.js";

export function toModel(schedule: AgendaScheduleType): AgendaScheduleModelType {
	const startTime = `${schedule.startTime.hour.toString().padStart(2, "0")}:${schedule.startTime.minute.toString().padStart(2, "0")}`;
	const endTime = `${schedule.endTime.hour.toString().padStart(2, "0")}:${schedule.endTime.minute.toString().padStart(2, "0")}`;

	const { year, month, day } = schedule.day;
	const dayString = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

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

	const [startHour, startMinute] = schedule.startTime.split(":").map(Number);
	const [endHour, endMinute] = schedule.endTime.split(":").map(Number);

	const [year, month, day] = schedule.day.split("-").map(Number);

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
