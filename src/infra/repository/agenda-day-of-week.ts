import type { AgendaDayOfWeekType } from "@domain/entities/agenda-day-of-week.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import * as AgendaDayOfWeekMapper from "@/infra/entities-mappers/agenda-day-of-week.js";
import { agendaDayOfWeek } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaDayOfWeekRepository
	extends ClassRepository
	implements IAgendaDayOfWeekRepository
{
	async create(data: AgendaDayOfWeekType): Promise<AgendaDayOfWeekType> {
		const model = AgendaDayOfWeekMapper.toModel(data);
		const created = await this.connection
			.insert(agendaDayOfWeek)
			.values(model)
			.returning();
		return AgendaDayOfWeekMapper.toEntity(created[0]);
	}

	async bulkCreate(
		data: AgendaDayOfWeekType[],
	): Promise<AgendaDayOfWeekType[]> {
		const models = data.map((item) => AgendaDayOfWeekMapper.toModel(item));
		const created = await this.connection
			.insert(agendaDayOfWeek)
			.values(models)
			.returning();
		return created.map((item) => AgendaDayOfWeekMapper.toEntity(item));
	}

	async getById(id: string): Promise<AgendaDayOfWeekType | null> {
		const found = await this.connection.query.agendaDayOfWeek.findFirst({
			where: {
				id,
			},
		});

		if (!found) return null;

		return AgendaDayOfWeekMapper.toEntity(found);
	}

	async getByAgendaConfigId(
		agendaConfigId: string,
	): Promise<AgendaDayOfWeekType[]> {
		const found = await this.connection.query.agendaDayOfWeek.findMany({
			where: { agendaConfigId },
		});

		return found.map((day) => AgendaDayOfWeekMapper.toEntity(day));
	}
}
