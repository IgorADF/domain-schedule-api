import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { DayObj } from "./value-objects/day.js";

export const OverwriteDaySchema = z.object({
  id: IdObj,
  agendaId: IdObj,
  day: DayObj,
  cancelAllDay: z.boolean(),
});

export type OverwriteDayType = z.infer<typeof OverwriteDaySchema>;
