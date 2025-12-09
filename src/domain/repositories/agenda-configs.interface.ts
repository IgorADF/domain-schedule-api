import { AgendaConfig } from "../entities/agenda-config.js";

export interface AgendaConfigsRepository {
  getBySellerId(sellerId: string): Promise<AgendaConfig>;
  create(data: AgendaConfig): Promise<AgendaConfig>;
}
