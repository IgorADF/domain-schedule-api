import {
	AgendaPeriodSchema,
	type AgendaPeriodType,
} from "@domain/entities/agenda-periods.js";
import type AgendaPeriodsModel from "../../database/models/agenda-periods.js";
import type { AgendaPeriodsModelType } from "../../database/models/agenda-periods.js";

export function toModel(period: AgendaPeriodType): AgendaPeriodsModelType {
	const startTime = new Date();
	startTime.setHours(period.startTime.hour, period.startTime.minute, 0, 0);

	const endTime = new Date();
	endTime.setHours(period.endTime.hour, period.endTime.minute, 0, 0);

	return {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId,
		startTime,
		endTime,
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval,
		order: period.order,
		createdAt: period.createdAt,
		updatedAt: period.updatedAt,
	};
}

export function toEntity(_period: AgendaPeriodsModel): AgendaPeriodType {
	const period = _period.toJSON();

	const map: AgendaPeriodType = {
		id: period.id,
		agendaDayOfWeekId: period.agendaDayOfWeekId,
		startTime: {
			hour: period.startTime.getHours(),
			minute: period.startTime.getMinutes(),
		},
		endTime: {
			hour: period.endTime.getHours(),
			minute: period.endTime.getMinutes(),
		},
		minutesOfService: period.minutesOfService,
		minutesOfInterval: period.minutesOfInterval,
		order: period.order,
		createdAt: period.createdAt,
		updatedAt: period.updatedAt,
	};

	const entity = AgendaPeriodSchema.parse(map);
	return entity;
}
