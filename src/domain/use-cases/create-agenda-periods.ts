import z from "zod";
import { uuidv7 } from "uuidv7";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { TimeObj } from "../entities/value-objects/time.js";
import {
  AgendaPeriodSchema,
  AgendaPeriodType,
} from "../entities/agenda-periods.js";
import { IdObj } from "../entities/value-objects/id.js";

export const CreateAgendaPeriodsSchema = z.array(
  z.object({
    agendaDayOfWeekId: IdObj,
    overwriteId: IdObj.optional(),
    startTime: TimeObj,
    endTime: TimeObj,
    minutesOfService: z.number(),
    minutesOfInterval: z.number().positive().min(1).optional(),
  })
);

export type CreateAgendaPeriodsType = z.infer<typeof CreateAgendaPeriodsSchema>;

export class CreateAgendaPeriodsUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(
    input: CreateAgendaPeriodsType
  ): Promise<{ data: AgendaPeriodType[] }> {
    const formattedPeriods: AgendaPeriodType[] = [];

    for (let iPeriods = 0; iPeriods < input.length; iPeriods++) {
      const period = input[iPeriods];

      const now = new Date();

      const formattedPeriod: AgendaPeriodType = {
        ...period,

        id: uuidv7(),
        order: iPeriods + 1,
        createdAt: now,
        updatedAt: now,
      };

      const parsedPeriod = AgendaPeriodSchema.parse(formattedPeriod);
      formattedPeriods.push(parsedPeriod);
    }

    await this.uow.agendaPeriodsRepository.bulkCreate(formattedPeriods);

    return { data: formattedPeriods };
  }
}
