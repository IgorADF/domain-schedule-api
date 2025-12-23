import type { Transaction as SequelizeTransaction } from "sequelize";
import type { AgendaPeriodType } from "@domain/entities/agenda-periods.js";
import type { IAgendaPeriodsRepository } from "@domain/repositories/agenda-periods.interface.js";
import { AgendaPeriodsMapper } from "../database/entities-mappers/agenda-periods.js";
import { AgendaPeriodsModel } from "../database/models/agenda-periods.js";

export class AgendaPeriodsRepository implements IAgendaPeriodsRepository {
  private transaction: SequelizeTransaction;

  constructor(_transaction: SequelizeTransaction) {
    this.transaction = _transaction;
  }

  async bulkCreate(data: AgendaPeriodType[]) {
    const modelInstances = data.map((period) =>
      AgendaPeriodsMapper.toModel(period)
    );
    const periods = await AgendaPeriodsModel.bulkCreate(modelInstances, {
      transaction: this.transaction,
    });
    return periods.map((period) => AgendaPeriodsMapper.toEntity(period));
  }
}
