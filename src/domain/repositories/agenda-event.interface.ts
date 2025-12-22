import type { AgendaEventType } from "../entities/agenda-event.js";

export interface IAgendaEventRepository {
	create(data: AgendaEventType): Promise<AgendaEventType>;
	bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]>;
	findByAgendaConfigId(agendaConfigId: string): Promise<AgendaEventType[]>;
}
