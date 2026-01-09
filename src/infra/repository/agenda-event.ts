import type { AgendaEventType } from "@domain/entities/agenda-event.js";
import type {
	AgendaEventOrderBy,
	IAgendaEventRepository,
} from "@domain/repositories/agenda-event.interface.js";
import * as AgendaEventMapper from "../../entities/mappers/agenda-event.js";
import AgendaEventModel from "../database/models/agenda-event.js";
import { ClassRepository } from "./_default.js";

export class AgendaEventRepository
	extends ClassRepository
	implements IAgendaEventRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(AgendaEventModel);

	async create(data: AgendaEventType): Promise<AgendaEventType> {
		const modelInstance = AgendaEventMapper.toModel(data);
		const created = await this.sequelizeRepository.create(modelInstance, {
			transaction: this.transaction,
		});
		return AgendaEventMapper.toEntity(created);
	}

	async bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]> {
		const modelInstances = data.map((event) =>
			AgendaEventMapper.toModel(event),
		);
		const created = await this.sequelizeRepository.bulkCreate(modelInstances, {
			transaction: this.transaction,
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

		const { rows, count } = await this.sequelizeRepository.findAndCountAll({
			where: { agendaConfigId },
			limit: pageSize,
			offset,
			order: [[orderBy.field, orderBy.direction]],
			transaction: this.transaction,
		});

		return {
			items: rows.map((event) => AgendaEventMapper.toEntity(event)),
			total: count,
		};
	}
}
