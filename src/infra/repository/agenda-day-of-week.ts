import type { AgendaDayOfWeekType } from "@domain/entities/agenda-day-of-week.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import * as AgendaDayOfWeekMapper from "@infra/entities-mappers/agenda-day-of-week.js";
import AgendaDayOfWeekModel from "../database/models/agenda-day-of-week.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaDayOfWeekRepository
	extends ClassRepository
	implements IAgendaDayOfWeekRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(AgendaDayOfWeekModel);

	async create(data: AgendaDayOfWeekType): Promise<AgendaDayOfWeekType> {
		const model = AgendaDayOfWeekMapper.toModel(data);
		const created = await this.sequelizeRepository.create(model, {
			transaction: this.transaction,
		});
		return AgendaDayOfWeekMapper.toEntity(created);
	}

	async bulkCreate(
		data: AgendaDayOfWeekType[],
	): Promise<AgendaDayOfWeekType[]> {
		const models = data.map((item) => AgendaDayOfWeekMapper.toModel(item));
		const created = await this.sequelizeRepository.bulkCreate(models, {
			transaction: this.transaction,
		});
		return created.map((item) => AgendaDayOfWeekMapper.toEntity(item));
	}

	async getById(id: string): Promise<AgendaDayOfWeekType | null> {
		const found = await this.sequelizeRepository.findByPk(id, {
			transaction: this.transaction,
		});

		if (!found) return null;

		return AgendaDayOfWeekMapper.toEntity(found);
	}

	async getByAgendaConfigId(
		agendaConfigId: string,
	): Promise<AgendaDayOfWeekType[]> {
		const found = await this.sequelizeRepository.findAll({
			where: { agendaConfigId },
			transaction: this.transaction,
		});

		return found.map((day) => AgendaDayOfWeekMapper.toEntity(day));
	}
}
