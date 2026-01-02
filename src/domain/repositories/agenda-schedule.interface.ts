import type z from "zod";
import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { DayObj } from "../shared/value-objects/day.js";

export interface IAgendaScheduleRepository {
	create(data: AgendaScheduleType): Promise<AgendaScheduleType>;
	getByDateRange(
		agendaConfigId: string,
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
	): Promise<AgendaScheduleType[]>;
}
