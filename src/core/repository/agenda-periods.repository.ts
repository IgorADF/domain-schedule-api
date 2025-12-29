import type { AgendaPeriodType } from "@domain/entities/agenda-periods.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import { AgendaPeriodsModel } from "../database/models/agenda-periods.js";
import * as AgendaPeriodsMapper from "../entities/mappers/agenda-periods.js";
import { ClassRepository } from "./_default.js";

export class AgendaPeriodsRepository
	extends ClassRepository
	implements IAgendaPeriodsRepository
{
	async bulkCreate(data: AgendaPeriodType[]) {
		const modelInstances = data.map((period) =>
			AgendaPeriodsMapper.toModel(period),
		);
		const periods = await AgendaPeriodsModel.bulkCreate(modelInstances, {
			transaction: this.transaction,
		});
		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}
}
