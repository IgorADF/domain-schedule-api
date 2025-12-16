import z from "zod";
import { uuidv7 } from "uuidv7";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import {
  AgendaDayOfWeekSchema,
  AgendaDayOfWeekType,
} from "../entities/agenda-day-of-week.js";

export const CreateAgendaDayOfWeekSchema = AgendaDayOfWeekSchema.pick({
  agendaConfigId: true,
  dayOfWeek: true,
  cancelAllDay: true,
});

export type CreateAgendaDayOfWeekType = z.infer<
  typeof CreateAgendaDayOfWeekSchema
>;

export class CreateAgendaDayOfWeekUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(
    input: CreateAgendaDayOfWeekType,
    persistData: boolean = true
  ): Promise<{ data: AgendaDayOfWeekType }> {
    const now = new Date();

    const agendaDayOfWeek: AgendaDayOfWeekType = {
      ...input,

      id: uuidv7(),
      createdAt: now,
      updatedAt: now,
    };

    const parsedDayOfWeek = AgendaDayOfWeekSchema.parse(agendaDayOfWeek);

    if (persistData) {
      await CreateAgendaDayOfWeekUseCase.persist(parsedDayOfWeek, this.uow);
    }

    return { data: parsedDayOfWeek };
  }

  static async persist(data: AgendaDayOfWeekType, uow: IUnitOfWork) {
    await uow.agendaDayOfWeekRepository.create(data);
  }

  static async bulkPersist(data: AgendaDayOfWeekType[], uow: IUnitOfWork) {
    await uow.agendaDayOfWeekRepository.bulkCreate(data);
  }
}
