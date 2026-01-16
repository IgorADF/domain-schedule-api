import type { AgendaScheduleType } from "@domain/entities/agenda-schedule.js";
import type { IAgendaScheduleRepository } from "@domain/repositories/agenda-schedule.interface.js";
import type { DayType } from "@domain/shared/value-objects/day.js";
import * as AgendaScheduleMapper from "@/infra/entities-mappers/agenda-schedule.js";
import { agendaSchedules } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaScheduleRepository
	extends ClassRepository
	implements IAgendaScheduleRepository
{
	async create(data: AgendaScheduleType) {
		const modelInstance = AgendaScheduleMapper.toModel(data);
		const schedule = await this.connection
			.insert(agendaSchedules)
			.values(modelInstance)
			.returning();
		return AgendaScheduleMapper.toEntity(schedule[0]);
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<AgendaScheduleType[]> {
		const initialDateString = `${initialDate.year}-${initialDate.month.toString().padStart(2, "0")}-${initialDate.day.toString().padStart(2, "0")}`;
		const finalDateString = `${finalDate.year}-${finalDate.month.toString().padStart(2, "0")}-${finalDate.day.toString().padStart(2, "0")}`;

		const schedules = await this.connection.query.agendaSchedules.findMany({
			where: {
				agendaConfigId: agendaConfigId,
				day: {
					gte: initialDateString,
					lte: finalDateString,
				},
			},
		});

		return schedules.map((s) => AgendaScheduleMapper.toEntity(s));
	}
}
