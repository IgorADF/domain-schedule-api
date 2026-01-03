import type { AgendaScheduleType } from "@domain/entities/agenda-schedule.js";
import type { IAgendaScheduleRepository } from "@domain/repositories/agenda-schedule.interface.js";
import type { DayObj } from "@domain/shared/value-objects/day.js";
import { Op } from "sequelize";
import type z from "zod";
import AgendaScheduleModel from "../database/models/agenda-schedule.js";
import * as AgendaScheduleMapper from "../entities/mappers/agenda-schedule.js";
import { ClassRepository } from "./_default.js";

export class AgendaScheduleRepository
	extends ClassRepository
	implements IAgendaScheduleRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(AgendaScheduleModel);

	async create(data: AgendaScheduleType) {
		const modelInstance = AgendaScheduleMapper.toModel(data);
		const schedule = await this.sequelizeRepository.create(modelInstance, {
			transaction: this.transaction,
		});
		return AgendaScheduleMapper.toEntity(schedule);
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
	): Promise<AgendaScheduleType[]> {
		const initialDateString = `${initialDate.year}-${initialDate.month.toString().padStart(2, "0")}-${initialDate.day.toString().padStart(2, "0")}`;
		const finalDateString = `${finalDate.year}-${finalDate.month.toString().padStart(2, "0")}-${finalDate.day.toString().padStart(2, "0")}`;

		const schedules = await this.sequelizeRepository.findAll({
			where: {
				agendaConfigId,
				day: {
					[Op.between]: [initialDateString, finalDateString],
				},
			},
			transaction: this.transaction,
		});

		return schedules.map((s) => AgendaScheduleMapper.toEntity(s));
	}
}
