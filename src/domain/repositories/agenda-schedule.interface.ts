import type { AgendaScheduleType } from "../entities/agenda-schedule.js";

export interface IAgendaScheduleRepository {
	create(data: AgendaScheduleType): Promise<AgendaScheduleType>;
}
