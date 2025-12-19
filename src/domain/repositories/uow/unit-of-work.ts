import { ISellerRepository } from "../seller.interface.js";
import { IAgendaPeriodsRepository } from "../agenda-periods.interface.js";
import { IAgendaDayOfWeekRepository } from "../agenda-day-of-week.interface.js";
import { IAgendaConfigsRepository } from "../agenda-configs.interface.js";
import { IAgendaEventRepository } from "../agenda-event.interface.js";

export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;

  get sellerRepository(): ISellerRepository;
  get agendaPeriodsRepository(): IAgendaPeriodsRepository;
  get agendaDayOfWeekRepository(): IAgendaDayOfWeekRepository;
  get agendaConfigsRepository(): IAgendaConfigsRepository;
  get agendaEventRepository(): IAgendaEventRepository;
}
