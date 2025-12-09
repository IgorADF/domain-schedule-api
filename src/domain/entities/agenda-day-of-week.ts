import z from "zod";
import { IdObj } from "./value-objects/id.js";

export const AgendaDayOfWeekSchema = z.object({
  id: IdObj,
  agendaConfigId: IdObj,
  dayOfWeek: z.number().min(1).max(7),
});

export type AgendaDayOfWeekType = z.infer<typeof AgendaDayOfWeekSchema>;
