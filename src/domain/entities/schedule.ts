import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { DayObj } from "./value-objects/day.js";
import { TimeObj } from "./value-objects/time.js";
import { Timestamp } from "./value-objects/timestamp.js";

export const ScheduleSchema = z
  .object({
    id: IdObj,
    sellerId: IdObj,
    clientName: z.string().min(1).max(50),
    clientPhoneNumber: z.string().min(1).max(50),
    day: DayObj,
    startTime: TimeObj,
    endTime: TimeObj,
  })
  .extend(Timestamp.shape);

export type ScheduleType = z.infer<typeof ScheduleSchema>;
