import type { AgendaConfigType } from "@domain/entities/agenda-config.js";
import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import * as AgendaConfigsMapper from "@infra/entities-mappers/agenda-configs.js";
import { ClassRepository } from "@/infra/repository/_base-class.js";
import AgendaConfigsModel from "../database/models/agenda-configs.js";

export class AgendaConfigsRepository
	extends ClassRepository
	implements IAgendaConfigsRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(AgendaConfigsModel);

	async create(data: AgendaConfigType): Promise<AgendaConfigType> {
		const model = AgendaConfigsMapper.toModel(data);
		const created = await this.sequelizeRepository.create(model, {
			transaction: this.transaction,
		});
		return AgendaConfigsMapper.toEntity(created);
	}

	async getById(id: string): Promise<AgendaConfigType | null> {
		const found = await this.sequelizeRepository.findByPk(id, {
			transaction: this.transaction,
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}

	async getBySellerId(sellerId: string): Promise<AgendaConfigType | null> {
		const found = await this.sequelizeRepository.findOne({
			where: { sellerId },
			transaction: this.transaction,
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}
}
