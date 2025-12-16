import z from "zod";
import { uuidv7 } from "uuidv7";
import { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import {
  AgendaConfigSchema,
  AgendaConfigType,
} from "../entities/agenda-config.js";

export const CreateAgendaConfigSchema = AgendaConfigSchema.pick({
  sellerId: true,
  maxDaysOfAdvancedNotice: true,
  minHoursOfAdvancedNotice: true,
  timezone: true,
});

export type CreateAgendaConfigType = z.infer<typeof CreateAgendaConfigSchema>;

export class CreateAgendaConfigUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: CreateAgendaConfigType): Promise<{
    data: AgendaConfigType;
  }> {
    const now = new Date();
    const agendaConfigId = uuidv7();

    const agendaConfig: AgendaConfigType = {
      id: agendaConfigId,
      sellerId: input.sellerId,
      maxDaysOfAdvancedNotice: input.maxDaysOfAdvancedNotice,
      minHoursOfAdvancedNotice: input.minHoursOfAdvancedNotice,
      timezone: input.timezone,
      createdAt: now,
      updatedAt: now,
    };

    const parsedConfig = AgendaConfigSchema.parse(agendaConfig);

    const createdConfig = await this.uow.agendaConfigsRepository.create(
      parsedConfig
    );

    return {
      data: createdConfig,
    };
  }
}
