import type { IAgendaConfigsRepository } from "../agenda-configs.interface.js";
import type { IAgendaDayOfWeekRepository } from "../agenda-day-of-week.interface.js";
import type { IAgendaEventRepository } from "../agenda-event.interface.js";
import type { IAgendaPeriodsRepository } from "../agenda-periods.interface.js";
import type { ISellerRepository } from "../seller.interface.js";

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
