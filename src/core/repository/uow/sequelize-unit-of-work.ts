import { Transaction as SequelizeTransaction } from "sequelize";
import { ISellerRepository } from "../../../domain/repositories/seller.interface.js";
import { Class } from "../../@types/class.js";
import { sequelizeConnection } from "../../database/connection.js";
import { SellerRepository } from "../seller.repository.js";
import { IUnitOfWork } from "../../../domain/repositories/uow/unit-of-work.js";
import { IAgendaPeriodsRepository } from "../../../domain/repositories/agenda-periods.interface.js";
import { AgendaPeriodsRepository } from "../agenda-periods.repository.js";

export class SequelizeUnitOfWork implements IUnitOfWork {
  private transaction: SequelizeTransaction | null = null;

  private _sellerRepository: ISellerRepository | null = null;
  private _agendaPeriodsRepository: IAgendaPeriodsRepository | null = null;

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
}
