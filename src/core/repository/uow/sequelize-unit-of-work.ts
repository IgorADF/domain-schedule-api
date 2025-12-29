import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import type { IAgendaDayOfWeekRepository } from "@domain/repositories/agenda-day-of-week.interface.js";
import type { IAgendaEventRepository } from "@domain/repositories/agenda-event.interface.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import type { ISellerRepository } from "@domain/repositories/seller.interface.js";
import type { IUnitOfWork } from "@domain/repositories/uow/unit-of-work.js";
import type { Transaction as SequelizeTransaction } from "sequelize";
import type { Class } from "@/@types/class.js";
import { RedisCacheService } from "@/core/cache/service.js";
import { sequelizeConnection } from "../../database/connection.js";
import { AgendaConfigsRepository } from "../agenda-configs.repository.js";
import { AgendaDayOfWeekRepository } from "../agenda-day-of-week.repository.js";
import { AgendaEventRepository } from "../agenda-event.repository.js";
import { AgendaPeriodsRepository } from "../agenda-periods.repository.js";
import { CachedSellerRepository } from "../cache/seller.repository.js";
import { SellerRepository } from "../seller.repository.js";

const breakCharIndex = 1;

type CacheRepositoryNames =
	| "sellerRepository"
	| "agendaPeriodsRepository"
	| "agendaDayOfWeekRepository"
	| "agendaConfigsRepository"
	| "agendaEventRepository";

type RepositoriesToCache = {
	[K in CacheRepositoryNames]?: true;
};

export class SequelizeUnitOfWork implements IUnitOfWork {
	private transaction: SequelizeTransaction | null = null;

	private _sellerRepository: ISellerRepository | null = null;
	private _agendaPeriodsRepository: IAgendaPeriodsRepository | null = null;
	private _agendaDayOfWeekRepository: IAgendaDayOfWeekRepository | null = null;
	private _agendaConfigsRepository: IAgendaConfigsRepository | null = null;
	private _agendaEventRepository: IAgendaEventRepository | null = null;

	constructor(
		private configs: { repositoriesToCache: RepositoriesToCache } = {
			repositoriesToCache: {},
		},
	) {}

	resetTransaction() {
		this.transaction = null;
	}

	async beginTransaction() {
		this.transaction = await sequelizeConnection.transaction();
	}

	async commitTransaction() {
		if (!this.transaction) return;

		await this.transaction.commit();
		this.resetTransaction();
	}

	async rollbackTransaction() {
		if (!this.transaction) return;

		await this.transaction.rollback();
		this.resetTransaction();
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

			const classInstance = new ClassDef(this.transaction);

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
}
