import type { Transaction as SequelizeTransaction } from "sequelize";
import type { AgendaConfigType } from "@domain/entities/agenda-config.js";
import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import { AgendaConfigsMapper } from "../database/entities-mappers/agenda-configs.js";
import { AgendaConfigsModel } from "../database/models/agenda-configs.js";

export class AgendaConfigsRepository implements IAgendaConfigsRepository {
	constructor(private transaction: SequelizeTransaction | null) {}

	async create(data: AgendaConfigType): Promise<AgendaConfigType> {
		const model = AgendaConfigsMapper.toModel(data);
		const created = await AgendaConfigsModel.create(model, {
			transaction: this.transaction,
		});
		return AgendaConfigsMapper.toEntity(created);
	}

	async getBySellerId(sellerId: string): Promise<AgendaConfigType | null> {
		const found = await AgendaConfigsModel.findOne({
			where: { sellerId },
			transaction: this.transaction,
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}
}
