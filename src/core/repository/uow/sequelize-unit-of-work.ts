import { Transaction as SequelizeTransaction } from "sequelize";
import { ISellerRepository } from "../../../domain/repositories/seller.interface.js";
import { Class } from "../../@types/class.js";
import { sequelizeConnection } from "../../database/connection.js";
import { SellerRepository } from "../seller.repository.js";
import { IUnitOfWork } from "../../../domain/repositories/uow/unit-of-work.js";
import { IAgendaPeriodsRepository } from "../../../domain/repositories/agenda-periods.interface.js";
import { AgendaPeriodsRepository } from "../agenda-periods.repository.js";
import { IAgendaDayOfWeekRepository } from "../../../domain/repositories/agenda-day-of-week.interface.js";
import { AgendaDayOfWeekRepository } from "../agenda-day-of-week.repository.js";
import { IAgendaConfigsRepository } from "../../../domain/repositories/agenda-configs.interface.js";
import { AgendaConfigsRepository } from "../agenda-configs.repository.js";

export class SequelizeUnitOfWork implements IUnitOfWork {
  private transaction: SequelizeTransaction | null = null;

  private _sellerRepository: ISellerRepository | null = null;
  private _agendaPeriodsRepository: IAgendaPeriodsRepository | null = null;
  private _agendaDayOfWeekRepository: IAgendaDayOfWeekRepository | null = null;
  private _agendaConfigsRepository: IAgendaConfigsRepository | null = null;

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

  private createAndGetRepository<T>(ClassDef: Class, propName: keyof this) {
    if (!this[propName as keyof this]) {
      this[propName as keyof this] = new ClassDef(this.transaction);
    }

    return this[propName as keyof this] as T;
  }

  get sellerRepository() {
    return this.createAndGetRepository<ISellerRepository>(
      SellerRepository,
      "_sellerRepository" as keyof this
    );
  }

  get agendaPeriodsRepository() {
    return this.createAndGetRepository<IAgendaPeriodsRepository>(
      AgendaPeriodsRepository,
      "_agendaPeriodsRepository" as keyof this
    );
  }

  get agendaDayOfWeekRepository() {
    return this.createAndGetRepository<IAgendaDayOfWeekRepository>(
      AgendaDayOfWeekRepository,
      "_agendaDayOfWeekRepository" as keyof this
    );
  }

  get agendaConfigsRepository() {
    return this.createAndGetRepository<IAgendaConfigsRepository>(
      AgendaConfigsRepository,
      "_agendaConfigsRepository" as keyof this
    );
  }
}
