import type { AgendaDayOfWeekType } from "@domain/entities/agenda-day-of-week.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import type { Transaction as SequelizeTransaction } from "sequelize";
import { AgendaDayOfWeekMapper } from "../database/entities-mappers/agenda-day-of-week.js";
import { AgendaDayOfWeekModel } from "../database/models/agenda-day-of-week.js";

export class AgendaDayOfWeekRepository implements IAgendaDayOfWeekRepository {
	constructor(private transaction: SequelizeTransaction | null) {}

	async create(data: AgendaDayOfWeekType): Promise<AgendaDayOfWeekType> {
		const model = AgendaDayOfWeekMapper.toModel(data);
		const created = await AgendaDayOfWeekModel.create(model, {
			transaction: this.transaction,
		});
		return AgendaDayOfWeekMapper.toEntity(created);
	}

	async bulkCreate(
		data: AgendaDayOfWeekType[],
	): Promise<AgendaDayOfWeekType[]> {
		const models = data.map((item) => AgendaDayOfWeekMapper.toModel(item));
		const created = await AgendaDayOfWeekModel.bulkCreate(models, {
			transaction: this.transaction,
		});
		return created.map((item) => AgendaDayOfWeekMapper.toEntity(item));
	}

	async getById(id: string): Promise<AgendaDayOfWeekType | null> {
		const found = await AgendaDayOfWeekModel.findByPk(id, {
			transaction: this.transaction,
		});

		if (!found) return null;

		return AgendaDayOfWeekMapper.toEntity(found);
	}

	async getByAgendaConfigId(
		agendaConfigId: string,
	): Promise<AgendaDayOfWeekType[]> {
		const found = await AgendaDayOfWeekModel.findAll({
			where: { agendaConfigId },
			transaction: this.transaction,
		});

		return found.map((day) => AgendaDayOfWeekMapper.toEntity(day));
	}
}
