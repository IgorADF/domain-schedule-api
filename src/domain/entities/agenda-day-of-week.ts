import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { Timestamp } from "./value-objects/timestamp.js";

export const AgendaDayOfWeekSchema = z
  .object({
    id: IdObj,
    agendaConfigId: IdObj,
    dayOfWeek: z.number().min(1).max(7),
    cancelAllDay: z.boolean(),
  })
  .extend(Timestamp.shape);

export type AgendaDayOfWeekType = z.infer<typeof AgendaDayOfWeekSchema>;
