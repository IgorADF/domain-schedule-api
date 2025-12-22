import type { AgendaPeriodType } from "../entities/agenda-periods.js";

export interface IAgendaPeriodsRepository {
	bulkCreate(data: AgendaPeriodType[]): Promise<AgendaPeriodType[]>;
}
