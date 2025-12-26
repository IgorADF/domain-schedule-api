import type { AgendaEventType } from "@domain/entities/agenda-event.js";
import type { IAgendaEventRepository } from "@domain/repositories/agenda-event.interface.js";
import type { Transaction as SequelizeTransaction } from "sequelize";
import { AgendaEventModel } from "../database/models/agenda-event.js";
import * as AgendaEventMapper from "../entities/mappers/agenda-event.js";

export class AgendaEventRepository implements IAgendaEventRepository {
	private transaction: SequelizeTransaction;

	constructor(_transaction: SequelizeTransaction) {
		this.transaction = _transaction;
	}

	async create(data: AgendaEventType): Promise<AgendaEventType> {
		const modelInstance = AgendaEventMapper.toModel(data);
		const created = await AgendaEventModel.create(modelInstance, {
			transaction: this.transaction,
		});
		return AgendaEventMapper.toEntity(created);
	}

	async bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]> {
		const modelInstances = data.map((event) =>
			AgendaEventMapper.toModel(event),
		);
		const created = await AgendaEventModel.bulkCreate(modelInstances, {
			transaction: this.transaction,
		});
		return created.map((event) => AgendaEventMapper.toEntity(event));
	}

	async findByAgendaConfigId(
		agendaConfigId: string,
	): Promise<AgendaEventType[]> {
		const events = await AgendaEventModel.findAll({
			where: { agendaConfigId },
			transaction: this.transaction,
		});
		return events.map((event) => AgendaEventMapper.toEntity(event));
	}
}
