import type { AgendaConfigType } from "@domain/entities/agenda-config.js";
import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import * as AgendaConfigsMapper from "@/infra/entities-mappers/agenda-configs.js";
import { agendaConfigs } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaConfigsRepository
	extends ClassRepository
	implements IAgendaConfigsRepository
{
	async create(data: AgendaConfigType): Promise<AgendaConfigType> {
		const model = AgendaConfigsMapper.toModel(data);
		const created = await this.connection
			.insert(agendaConfigs)
			.values(model)
			.returning();
		return AgendaConfigsMapper.toEntity(created[0]);
	}

	async getById(id: string): Promise<AgendaConfigType | null> {
		const found = await this.connection.query.agendaConfigs.findFirst({
			where: { id },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}

	async getBySellerId(sellerId: string): Promise<AgendaConfigType | null> {
		const found = await this.connection.query.agendaConfigs.findFirst({
			where: { sellerId },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}
}
