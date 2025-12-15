import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { TimeObj } from "./value-objects/time.js";
import { Timestamp } from "./value-objects/timestamp.js";

export const AgendaPeriodSchema = z
  .object({
    id: IdObj,
    agendaDayOfWeekId: IdObj,
    overwriteId: IdObj.optional(),
    startTime: TimeObj,
    endTime: TimeObj,
    minutesOfService: z.number().positive().min(5),
    minutesOfInterval: z.number().positive().min(5).optional(),
    order: z.number().positive().min(1).max(5),
  })
  .extend(Timestamp.shape);

export type AgendaPeriodType = z.infer<typeof AgendaPeriodSchema>;
