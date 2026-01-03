import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { DayType } from "../shared/value-objects/day.js";

export interface IAgendaScheduleRepository {
	create(data: AgendaScheduleType): Promise<AgendaScheduleType>;
	getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<AgendaScheduleType[]>;
}
