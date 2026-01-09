import type { AgendaPeriodType } from "@domain/entities/agenda-periods.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import * as AgendaPeriodsMapper from "../../entities/mappers/agenda-periods.js";
import AgendaPeriodsModel from "../database/models/agenda-periods.js";
import { ClassRepository } from "./_default.js";

export class AgendaPeriodsRepository
	extends ClassRepository
	implements IAgendaPeriodsRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(AgendaPeriodsModel);

	async bulkCreate(data: AgendaPeriodType[]) {
		const modelInstances = data.map((period) =>
			AgendaPeriodsMapper.toModel(period),
		);
		const periods = await this.sequelizeRepository.bulkCreate(modelInstances, {
			transaction: this.transaction,
		});
		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}

	async getByAgendaDayOfWeekIds(agendaDayOfWeekIds: string[]) {
		if (agendaDayOfWeekIds.length === 0) {
			return [];
		}

		const periods = await this.sequelizeRepository.findAll({
			where: { agendaDayOfWeekId: agendaDayOfWeekIds },
			transaction: this.transaction,
		});

		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}

	async getByOverwriteDayIds(overwriteDayIds: string[]) {
		if (overwriteDayIds.length === 0) {
			return [];
		}

		const periods = await this.sequelizeRepository.findAll({
			where: { overwriteDayId: overwriteDayIds },
			transaction: this.transaction,
		});

		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}
}
