import type { AgendaConfigType } from "../entities/agenda-config.js";

export interface IAgendaConfigsRepository {
	getById(id: string): Promise<AgendaConfigType | null>;
	getBySellerId(sellerId: string): Promise<AgendaConfigType | null>;
	create(data: AgendaConfigType): Promise<AgendaConfigType>;
}
