import {
  AgendaPeriodSchema,
  AgendaPeriodType,
} from "../../../domain/entities/agenda-periods.js";
import { AgendaPeriodsModel } from "../models/agenda-periods.js";

export class AgendaPeriodsMapper {
  static toModel(period: AgendaPeriodType): AgendaPeriodsModel {
    const startTime = new Date();
    startTime.setHours(period.startTime.hour, period.startTime.minute, 0, 0);

    const endTime = new Date();
    endTime.setHours(period.endTime.hour, period.endTime.minute, 0, 0);

    return new AgendaPeriodsModel({
      id: period.id,
      agendaDayOfWeekId: period.agendaDayOfWeekId,
      overwriteId: period.overwriteId,
      startTime,
      endTime,
      minutesOfService: period.minutesOfService,
      minutesOfInterval: period.minutesOfInterval,
      order: period.order,
      createdAt: period.createAt,
      updatedAt: period.updatedAt,
    });
  }

  static toEntity(_period: AgendaPeriodsModel): AgendaPeriodType {
    const period = _period.toJSON();

    const map: AgendaPeriodType = {
      id: period.id,
      agendaDayOfWeekId: period.agendaDayOfWeekId,
      overwriteId: period.overwriteId,
      startTime: {
        hour: period.startTime.getHours(),
        minute: period.startTime.getMinutes(),
      },
      endTime: {
        hour: period.endTime.getHours(),
        minute: period.endTime.getMinutes(),
      },
      minutesOfService: period.minutesOfService,
      minutesOfInterval: period.minutesOfInterval,
      order: period.order,
      createAt: period.createdAt,
      updatedAt: period.updatedAt,
    };

    const entity = AgendaPeriodSchema.parse(map);
    return entity;
  }
}
