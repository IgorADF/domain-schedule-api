import z from "zod";
import { uuidv7 } from "uuidv7";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import {
  AgendaDayOfWeekSchema,
  AgendaDayOfWeekType,
} from "../entities/agenda-day-of-week.js";

export const CreateAgendaDayOfWeekSchema = z.array(
  z.object({
    agendaConfigId: z.uuid(),
    dayOfWeek: z.number().min(1).max(7),
  })
);

export type CreateAgendaDayOfWeekType = z.infer<
  typeof CreateAgendaDayOfWeekSchema
>;

export class CreateAgendaDayOfWeekUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(
    input: CreateAgendaDayOfWeekType
  ): Promise<{ data: AgendaDayOfWeekType[] }> {
    const formattedDays: AgendaDayOfWeekType[] = [];
    const now = new Date();

    for (const dayOfWeekInput of input) {
      const agendaDayOfWeekId = uuidv7();

      const agendaDayOfWeek: AgendaDayOfWeekType = {
        id: agendaDayOfWeekId,
        agendaConfigId: dayOfWeekInput.agendaConfigId,
        dayOfWeek: dayOfWeekInput.dayOfWeek,
        createdAt: now,
        updatedAt: now,
      };

      const parsedDayOfWeek = AgendaDayOfWeekSchema.parse(agendaDayOfWeek);
      formattedDays.push(parsedDayOfWeek);
    }

    const createdDays = await this.uow.agendaDayOfWeekRepository.bulkCreate(
      formattedDays
    );

    return { data: createdDays };
  }
}
