import type { AgendaScheduleType } from "@domain/entities/agenda-schedule.js";
import type { IAgendaScheduleRepository } from "@domain/repositories/agenda-schedule.interface.js";
import { type DayType, toJSDate } from "@domain/shared/value-objects/day.js";
import * as AgendaScheduleMapper from "@/infra/database/prisma/entities-mappers/agenda-schedule.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaScheduleRepository
	extends ClassRepository
	implements IAgendaScheduleRepository
{
	async create(data: AgendaScheduleType) {
		const modelInstance = AgendaScheduleMapper.toModel(data);
		const schedule = await this.prismaClient.agendaSchedule.create({
			data: modelInstance,
		});
		return AgendaScheduleMapper.toEntity(schedule);
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<AgendaScheduleType[]> {
		const initialDateDate = toJSDate(initialDate);
		const finalDateDate = toJSDate(finalDate);

		const schedules = await this.prismaClient.agendaSchedule.findMany({
			where: {
				agendaConfigId: agendaConfigId,
				day: {
					gte: initialDateDate,
					lte: finalDateDate,
				},
			},
		});

		return schedules.map((s) => AgendaScheduleMapper.toEntity(s));
	}
}
