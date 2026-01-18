import type { AgendaEventType } from "@domain/entities/agenda-event.js";
import type {
	AgendaEventOrderBy,
	IAgendaEventRepository,
} from "@domain/repositories/agenda-event.interface.js";
import * as AgendaEventMapper from "@/infra/database/prisma/entities-mappers/agenda-event.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaEventRepository
	extends ClassRepository
	implements IAgendaEventRepository
{
	async create(data: AgendaEventType): Promise<AgendaEventType> {
		const modelInstance = AgendaEventMapper.toModel(data);
		const created = await this.prismaClient.agendaEvent.create({
			data: modelInstance,
		});
		return AgendaEventMapper.toEntity(created);
	}

	async bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]> {
		const modelInstances = data.map((event) =>
			AgendaEventMapper.toModel(event),
		);
		await this.prismaClient.agendaEvent.createMany({
			data: modelInstances,
		});

		// Prisma createMany doesn't return created records, so we need to fetch them
		const created = await this.prismaClient.agendaEvent.findMany({
			where: {
				id: { in: data.map((d) => d.id) },
			},
		});

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

		const [items, total] = await Promise.all([
			this.prismaClient.agendaEvent.findMany({
				where: { agendaConfigId },
				skip: offset,
				take: pageSize,
				orderBy: {
					[orderField]: orderDirection,
				},
			}),
			this.prismaClient.agendaEvent.count({
				where: { agendaConfigId },
			}),
		]);

		return {
			items: items.map((event) => AgendaEventMapper.toEntity(event)),
			total,
		};
	}
}
