import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";

export interface IAgendaDayOfWeekRepository {
	create(data: AgendaDayOfWeekType): Promise<AgendaDayOfWeekType>;
	bulkCreate(data: AgendaDayOfWeekType[]): Promise<AgendaDayOfWeekType[]>;
	getById(id: string): Promise<AgendaDayOfWeekType | null>;
	getByAgendaConfigId(agendaConfigId: string): Promise<AgendaDayOfWeekType[]>;
}
