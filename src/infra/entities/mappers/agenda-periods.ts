import {
	AgendaPeriodSchema,
	type AgendaPeriodType,
} from "@domain/entities/agenda-periods.js";
import type AgendaPeriodsModel from "../../database/models/agenda-periods.js";
import type { AgendaPeriodsModelType } from "../../database/models/agenda-periods.js";

export function toModel(period: AgendaPeriodType): AgendaPeriodsModelType {
	const startTime = `${String(period.startTime.hour).padStart(2, "0")}:${String(period.startTime.minute).padStart(2, "0")}:00`;
	const endTime = `${String(period.endTime.hour).padStart(2, "0")}:${String(period.endTime.minute).padStart(2, "0")}:00`;

	return {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId,
		startTime,
		endTime,
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval,
		order: period.order,
		creationDate: period.creationDate,
		updateDate: period.updateDate,
	};
}

export function toEntity(_period: AgendaPeriodsModel): AgendaPeriodType {
	const period = _period.toJSON();

	const [startHour, startMinute] = period.startTime.split(":").map(Number);
	const [endHour, endMinute] = period.endTime.split(":").map(Number);

	const map: AgendaPeriodType = {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId,
		startTime: {
			hour: startHour,
			minute: startMinute,
		},
		endTime: {
			hour: endHour,
			minute: endMinute,
		},
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval,
		order: period.order,
		creationDate: period.creationDate,
		updateDate: period.updateDate,
	};

	const entity = AgendaPeriodSchema.parse(map);
	return entity;
}
