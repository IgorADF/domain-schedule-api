import {
  OverwriteDaySchema,
  OverwriteDayType,
} from "../../../domain/entities/overwrite-day.js";
import { OverwriteDayModel } from "../models/overwrite-day.js";

export class OverwriteDayMapper {
  static toModel(overwriteDay: OverwriteDayType): OverwriteDayModel {
    const { year, month, day } = overwriteDay.day;

    return new OverwriteDayModel({
      id: overwriteDay.id,
      agendaId: overwriteDay.agendaId,
      day: new Date(year, month - 1, day),
      cancelAllDay: overwriteDay.cancelAllDay,
    });
  }

  static toEntity(_overwriteDay: OverwriteDayModel): OverwriteDayType {
    const overwriteDay = _overwriteDay.toJSON();

    const map: OverwriteDayType = {
      id: overwriteDay.id,
      agendaId: overwriteDay.agendaId,
      day: {
        year: overwriteDay.day.getFullYear(),
        month: overwriteDay.day.getMonth() + 1,
        day: overwriteDay.day.getDate(),
      },
      cancelAllDay: overwriteDay.cancelAllDay,
      createdAt: overwriteDay.createdAt,
      updatedAt: overwriteDay.updatedAt,
    };

    const entity = OverwriteDaySchema.parse(map);
    return entity;
  }
}
