import type { AgendaScheduleType } from "@domain/entities/agenda-schedule.js";
import type { IAgendaScheduleRepository } from "@domain/repositories/agenda-schedule.interface.js";
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
}
