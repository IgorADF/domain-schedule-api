import type { AgendaPeriodType } from "@domain/entities/agenda-periods.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import * as AgendaPeriodsMapper from "@/infra/entities-mappers/agenda-periods.js";
import { agendaPeriods } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaPeriodsRepository
	extends ClassRepository
	implements IAgendaPeriodsRepository
{
	async bulkCreate(data: AgendaPeriodType[]) {
		const modelInstances = data.map((period) =>
			AgendaPeriodsMapper.toModel(period),
		);
		const periods = await this.connection
			.insert(agendaPeriods)
			.values(modelInstances)
			.returning();
		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}

	async getByAgendaDayOfWeekIds(agendaDayOfWeekIds: string[]) {
		if (agendaDayOfWeekIds.length === 0) {
			return [];
		}

		const periods = await this.connection.query.agendaPeriods.findMany({
			where: {
				agendaDayOfWeekId: { in: agendaDayOfWeekIds },
			},
		});

		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}

	async getByOverwriteDayIds(overwriteDayIds: string[]) {
		if (overwriteDayIds.length === 0) {
			return [];
		}

		const periods = await this.connection.query.agendaPeriods.findMany({
			where: {
				overwriteDayId: { in: overwriteDayIds },
			},
		});

		return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
	}
}
