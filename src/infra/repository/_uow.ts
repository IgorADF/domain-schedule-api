import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import type { IAgendaEventRepository } from "@domain/repositories/agenda-event.interface.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import type { IAgendaScheduleRepository } from "@domain/repositories/agenda-schedule.interface.js";
import type { IOverwriteDayRepository } from "@domain/repositories/overwrite-day.interface.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import type { Class } from "@/@types/class.js";
import type { IUnitOfWork } from "@/domain/repositories/_uow.interface.js";
import { RedisCacheService } from "@/infra/cache/redis-service.js";
import { drizzleConnection } from "../database/connection.js";
import { AgendaConfigsRepository } from "./agenda-configs.js";
import { AgendaDayOfWeekRepository } from "./agenda-day-of-week.js";
import { AgendaEventRepository } from "./agenda-event.js";
import { AgendaPeriodsRepository } from "./agenda-periods.js";
import { AgendaScheduleRepository } from "./agenda-schedule.js";
import { CachedSellerRepository } from "./cached/seller.js";
import { OverwriteDayRepository } from "./overwrite-day.js";
import { SellerRepository } from "./seller.js";

const breakCharIndex = 1;

type CacheRepositoryNames =
	| "sellerRepository"
	| "agendaPeriodsRepository"
	| "agendaDayOfWeekRepository"
	| "agendaConfigsRepository"
	| "agendaEventRepository"
	| "agendaScheduleRepository"
	| "overwriteDayRepository";

type RepositoriesToCache = {
	[K in CacheRepositoryNames]?: true;
};

export class DrizzleUnitOfWork implements IUnitOfWork {
	private _sellerRepository: ISellerRepository | null = null;
	private _agendaPeriodsRepository: IAgendaPeriodsRepository | null = null;
	private _agendaDayOfWeekRepository: IAgendaDayOfWeekRepository | null = null;
	private _agendaConfigsRepository: IAgendaConfigsRepository | null = null;
	private _agendaEventRepository: IAgendaEventRepository | null = null;
	private _agendaScheduleRepository: IAgendaScheduleRepository | null = null;
	private _overwriteDayRepository: IOverwriteDayRepository | null = null;

	constructor(
		private configs: { repositoriesToCache: RepositoriesToCache } = {
			repositoriesToCache: {},
		},
	) {}

	static create() {
		return new DrizzleUnitOfWork();
	}

	async withTransaction<T>(fn: () => Promise<T>): Promise<T> {
		return await drizzleConnection.transaction(async (tx) => {
			return fn();
		});
	}

	private createAndGetRepository<T>(
		ClassDef: Class,
		propName: keyof this,
		CachedClassDef?: Class,
	) {
		if (!this[propName]) {
			const shouldCreateCacheRep =
				this.configs.repositoriesToCache[
					(propName as string).substring(breakCharIndex) as CacheRepositoryNames
				] ?? false;

			const classInstance = new ClassDef(drizzleConnection);

			if (shouldCreateCacheRep && CachedClassDef) {
				const cacheService = RedisCacheService.createInstance();
				this[propName] = new CachedClassDef(classInstance, cacheService);
			} else {
				this[propName] = classInstance;
			}
		}

		return this[propName] as T;
	}

	get sellerRepository() {
		return this.createAndGetRepository<ISellerRepository>(
			SellerRepository,
			"_sellerRepository" as keyof this,
			CachedSellerRepository,
		);
	}

	get agendaPeriodsRepository() {
		return this.createAndGetRepository<IAgendaPeriodsRepository>(
			AgendaPeriodsRepository,
			"_agendaPeriodsRepository" as keyof this,
		);
	}

	get agendaDayOfWeekRepository() {
		return this.createAndGetRepository<IAgendaDayOfWeekRepository>(
			AgendaDayOfWeekRepository,
			"_agendaDayOfWeekRepository" as keyof this,
		);
	}

	get agendaConfigsRepository() {
		return this.createAndGetRepository<IAgendaConfigsRepository>(
			AgendaConfigsRepository,
			"_agendaConfigsRepository" as keyof this,
		);
	}

	get agendaEventRepository() {
		return this.createAndGetRepository<IAgendaEventRepository>(
			AgendaEventRepository,
			"_agendaEventRepository" as keyof this,
		);
	}

	get agendaScheduleRepository() {
		return this.createAndGetRepository<IAgendaScheduleRepository>(
			AgendaScheduleRepository,
			"_agendaScheduleRepository" as keyof this,
		);
	}

	get overwriteDayRepository() {
		return this.createAndGetRepository<IOverwriteDayRepository>(
			OverwriteDayRepository,
			"_overwriteDayRepository" as keyof this,
		);
	}
}
