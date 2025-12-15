import { AgendaConfigType } from "../entities/agenda-config.js";

export interface IAgendaConfigsRepository {
  getBySellerId(sellerId: string): Promise<AgendaConfigType | null>;
  create(data: AgendaConfigType): Promise<AgendaConfigType>;
}
