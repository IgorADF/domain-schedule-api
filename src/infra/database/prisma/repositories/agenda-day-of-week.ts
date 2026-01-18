import type { AgendaDayOfWeekType } from "@domain/entities/agenda-day-of-week.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import * as AgendaDayOfWeekMapper from "@/infra/database/prisma/entities-mappers/agenda-day-of-week.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaDayOfWeekRepository
	extends ClassRepository
	implements IAgendaDayOfWeekRepository
{
	async create(data: AgendaDayOfWeekType): Promise<AgendaDayOfWeekType> {
		const model = AgendaDayOfWeekMapper.toModel(data);
		const created = await this.prismaClient.agendaDayOfWeek.create({
			data: model,
		});
		return AgendaDayOfWeekMapper.toEntity(created);
	}

	async bulkCreate(
		data: AgendaDayOfWeekType[],
	): Promise<AgendaDayOfWeekType[]> {
		const models = data.map((item) => AgendaDayOfWeekMapper.toModel(item));
		await this.prismaClient.agendaDayOfWeek.createMany({
			data: models,
		});

		// Fetch created records
		const created = await this.prismaClient.agendaDayOfWeek.findMany({
			where: {
				id: { in: data.map((d) => d.id) },
			},
		});

		return created.map((item) => AgendaDayOfWeekMapper.toEntity(item));
	}

	async getById(id: string): Promise<AgendaDayOfWeekType | null> {
		const found = await this.prismaClient.agendaDayOfWeek.findFirst({
			where: { id },
		});

		if (!found) return null;

		return AgendaDayOfWeekMapper.toEntity(found);
	}

	async getByAgendaConfigId(
		agendaConfigId: string,
	): Promise<AgendaDayOfWeekType[]> {
		const found = await this.prismaClient.agendaDayOfWeek.findMany({
			where: { agendaConfigId },
		});

		return found.map((day) => AgendaDayOfWeekMapper.toEntity(day));
	}
}
