import z from "zod";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import {
  CreateAgendaConfigSchema,
  CreateAgendaConfigUseCase,
} from "./create-agenda-config.js";
import { CreateAgendaDayOfWeekUseCase } from "./create-agenda-day-of-week.js";
import {
  CreateAgendaPeriodsSchema,
  CreateAgendaPeriodsType,
  CreateAgendaPeriodsUseCase,
} from "./create-agenda-periods.js";
import { AgendaConfigType } from "../entities/agenda-config.js";
import { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import { AgendaPeriodType } from "../entities/agenda-periods.js";
import { InvalidCreantionData } from "./errors/invalid-creation-data.js";

export const CreateCompleteAgendaSchema = z.object({
  sellerId: z.uuid(),
  maxDaysOfAdvancedNotice: z
    .number()
    .max(365 * 2)
    .positive(),
  minHoursOfAdvancedNotice: z.number().min(1).max(9999).positive().optional(),
  timezone: z.string().max(50),
  daysOfWeek: z
    .array(
      z.object({
        dayOfWeek: z.number().min(1).max(7),
        periods: z
          .array(
            CreateAgendaPeriodsSchema.element.omit({
              agendaDayOfWeekId: true,
              overwriteId: true,
            })
          )
          .length(7),
      })
    )
    .length(7),
});

export type CreateCompleteAgendaType = z.infer<
  typeof CreateCompleteAgendaSchema
>;

export class CreateCompleteAgendaUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: CreateCompleteAgendaType): Promise<void> {
    try {
      const { daysOfWeek, ...agendaConfig } = input;

      await this.uow.beginTransaction();

      const createdConfig = await this.createAgendaConfig(agendaConfig);

      const _daysOfWeek = daysOfWeek.map((e) => ({ dayOfWeek: e.dayOfWeek }));
      const createdDaysOfWeek = await this.createDaysOfWeek(
        createdConfig.data.id,
        _daysOfWeek
      );

      await this.createPeriodsForDays(createdDaysOfWeek.data, daysOfWeek);

      await this.uow.commitTransaction();
    } catch (error) {
      await this.uow.rollbackTransaction();
      throw error;
    }
  }

  private async createAgendaConfig(
    input: Omit<CreateCompleteAgendaType, "daysOfWeek">
  ): Promise<{ data: AgendaConfigType }> {
    const createConfigUseCase = new CreateAgendaConfigUseCase(this.uow);
    return await createConfigUseCase.execute({
      sellerId: input.sellerId,
      maxDaysOfAdvancedNotice: input.maxDaysOfAdvancedNotice,
      minHoursOfAdvancedNotice: input.minHoursOfAdvancedNotice,
      timezone: input.timezone,
    });
  }

  private async createDaysOfWeek(
    agendaConfigId: string,
    daysInput: Array<{ dayOfWeek: number }>
  ): Promise<{ data: AgendaDayOfWeekType[] }> {
    const formattedDays = daysInput.map((day) => ({
      agendaConfigId: agendaConfigId,
      dayOfWeek: day.dayOfWeek,
    }));

    const createDayOfWeekUseCase = new CreateAgendaDayOfWeekUseCase(this.uow);
    return await createDayOfWeekUseCase.execute(formattedDays);
  }

  private async createPeriodsForDays(
    createdDays: AgendaDayOfWeekType[],
    daysInput: CreateCompleteAgendaType["daysOfWeek"]
  ): Promise<void> {
    const allPeriodsFormatted = [];

    for (let i = 0; i < createdDays.length; i++) {
      const day = createdDays[i];
      const inputDay = daysInput[i];

      const periodsForDay = inputDay.periods.map((period) => ({
        agendaDayOfWeekId: day.id,
        ...period,
      }));

      allPeriodsFormatted.push(...periodsForDay);
    }

    const createPeriodsUseCase = new CreateAgendaPeriodsUseCase(this.uow);
    await createPeriodsUseCase.execute(allPeriodsFormatted);
  }
}
