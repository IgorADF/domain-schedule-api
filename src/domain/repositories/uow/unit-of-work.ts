import { ISellerRepository } from "../seller.interface.js";
import { IAgendaPeriodsRepository } from "../agenda-periods.interface.js";

export interface IUnitOfWork {
  beginTransaction(): Promise<void>;
  commitTransaction(): Promise<void>;
  rollbackTransaction(): Promise<void>;

  get sellerRepository(): ISellerRepository;
  get agendaPeriodsRepository(): IAgendaPeriodsRepository;
}
