import type { AgendaConfigType } from "@domain/entities/agenda-config.js";
import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import * as AgendaConfigsMapper from "@/infra/database/prisma/entities-mappers/agenda-configs.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaConfigsRepository
	extends ClassRepository
	implements IAgendaConfigsRepository
{
	async create(data: AgendaConfigType): Promise<AgendaConfigType> {
		const model = AgendaConfigsMapper.toModel(data);
		const created = await this.prismaClient.agendaConfig.create({
			data: model,
		});
		return AgendaConfigsMapper.toEntity(created);
	}

	async getById(id: string): Promise<AgendaConfigType | null> {
		const found = await this.prismaClient.agendaConfig.findFirst({
			where: { id },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}

	async getBySellerId(sellerId: string): Promise<AgendaConfigType | null> {
		const found = await this.prismaClient.agendaConfig.findFirst({
			where: { sellerId },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}
}
