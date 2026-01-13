import type { IAgendaConfigsRepository } from "./agenda-configs.interface.js";
import type { IAgendaDayOfWeekRepository } from "./agenda-day-of-week.interface.js";
import type { IAgendaEventRepository } from "./agenda-event.interface.js";
import type { IAgendaPeriodsRepository } from "./agenda-periods.interface.js";
import type { IAgendaScheduleRepository } from "./agenda-schedule.interface.js";
import type { IOverwriteDayRepository } from "./overwrite-day.interface.js";
import type { ISellerRepository } from "./seller.interface.js";

export interface IUnitOfWork {
	resetTransaction(): void;
	beginTransaction(): Promise<void>;
	commitTransaction(): Promise<void>;
	rollbackTransaction(): Promise<void>;
	withTransaction<T>(fn: () => Promise<T>): Promise<T>;

	get sellerRepository(): ISellerRepository;
	get agendaPeriodsRepository(): IAgendaPeriodsRepository;
	get agendaDayOfWeekRepository(): IAgendaDayOfWeekRepository;
	get agendaConfigsRepository(): IAgendaConfigsRepository;
	get agendaEventRepository(): IAgendaEventRepository;
	get agendaScheduleRepository(): IAgendaScheduleRepository;
	get overwriteDayRepository(): IOverwriteDayRepository;
}
