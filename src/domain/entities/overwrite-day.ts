import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { DayObj } from "./value-objects/day.js";
import { Timestamp } from "./value-objects/timestamp.js";

export const OverwriteDaySchema = z
  .object({
    id: IdObj,
    agendaId: IdObj,
    day: DayObj,
    cancelAllDay: z.boolean(),
  })
  .extend(Timestamp.shape);

export type OverwriteDayType = z.infer<typeof OverwriteDaySchema>;
