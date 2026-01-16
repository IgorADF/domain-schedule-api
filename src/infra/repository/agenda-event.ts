import type { AgendaEventType } from "@domain/entities/agenda-event.js";
import type {
	AgendaEventOrderBy,
	IAgendaEventRepository,
} from "@domain/repositories/agenda-event.interface.js";
import { count } from "drizzle-orm";
import * as AgendaEventMapper from "@/infra/entities-mappers/agenda-event.js";
import { agendaEvents } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaEventRepository
	extends ClassRepository
	implements IAgendaEventRepository
{
	async create(data: AgendaEventType): Promise<AgendaEventType> {
		const modelInstance = AgendaEventMapper.toModel(data);
		const created = await this.connection
			.insert(agendaEvents)
			.values(modelInstance)
			.returning();
		return AgendaEventMapper.toEntity(created[0]);
	}

	async bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]> {
		const modelInstances = data.map((event) =>
			AgendaEventMapper.toModel(event),
		);
		const created = await this.connection
			.insert(agendaEvents)
			.values(modelInstances)
			.returning();
		return created.map((event) => AgendaEventMapper.toEntity(event));
	}

	async findByAgendaConfigIdPaginated(
		agendaConfigId: string,
		page: number,
		pageSize: number,
		orderBy: AgendaEventOrderBy,
	): Promise<{ items: AgendaEventType[]; total: number }> {
		const offset = (page - 1) * pageSize;

		const orderField = orderBy.field;
		const orderDirection = orderBy.direction === "ASC" ? "asc" : "desc";

		const items = await this.connection.query.agendaEvents.findMany({
			where: {
				agendaConfigId,
			},
			limit: pageSize,
			offset,
			orderBy: {
				[orderField]: orderDirection,
			},
		});

		const totalResult = await this.connection
			.select({ count: count() })
			.from(agendaEvents);

		return {
			items: items.map((event) => AgendaEventMapper.toEntity(event)),
			total: totalResult[0].count,
		};
	}
}
