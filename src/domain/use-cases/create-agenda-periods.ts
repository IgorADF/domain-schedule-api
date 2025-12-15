import z from "zod";
import { uuidv7 } from "uuidv7";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { TimeObj } from "../entities/value-objects/time.js";
import {
  AgendaPeriodSchema,
  AgendaPeriodType,
} from "../entities/agenda-periods.js";

export const CreateAgendaPeriodsSchema = z.object({
  generalData: z.object({
    agendaDayOfWeekId: z.uuidv7(),
    overwriteId: z.uuidv7(),
  }),
  periods: z.array(
    z.object({
      startTime: TimeObj,
      endTime: TimeObj,
      minutesOfService: z.number().positive(),
      minutesOfInterval: z
        .number()
        .positive()
        .min(1)
        .refine((val) => val >= 5, {
          message: "Minimum interval must be at least 5 minutes",
        }),
    })
  ),
});

export type CreateAgendaPeriodsType = z.infer<typeof CreateAgendaPeriodsSchema>;

export class CreateAgendaPeriodsUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute({
    generalData,
    periods,
  }: CreateAgendaPeriodsType): Promise<{ data: AgendaPeriodType[] }> {
    const formattedPeriods: AgendaPeriodType[] = [];

    const now = new Date();

    for (let iPeriods = 0; iPeriods < periods.length; iPeriods++) {
      const period = periods[iPeriods];

      const formattedPeriod: AgendaPeriodType = {
        ...period,

        id: uuidv7(),
        agendaDayOfWeekId: generalData.agendaDayOfWeekId,
        overwriteId: generalData.overwriteId,
        order: iPeriods + 1,
        createAt: now,
        updatedAt: now,
      };

      const parsedPeriod = AgendaPeriodSchema.parse(formattedPeriod);
      formattedPeriods.push(parsedPeriod);
    }

    await this.uow.agendaPeriodsRepository.bulkCreate(formattedPeriods);

    return { data: formattedPeriods };
  }
}
