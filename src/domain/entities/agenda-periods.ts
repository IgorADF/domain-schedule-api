import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { TimeObj } from "./value-objects/time.js";

export const AgendaPeriodSchema = z.object({
  id: IdObj,
  agendaDayOfWeekId: IdObj,
  overwriteId: IdObj,
  startTime: TimeObj,
  endTime: TimeObj,
  minutesOfService: z.number().positive(),
  minutesOfInterval: z
    .number()
    .positive()
    .min(1)
    .refine((val) => val >= 5, {
      message: "Minimum interval must be at least 5 minutes",
    }),
  order: z.number().positive().min(1),
  createAt: z.date(),
  updatedAt: z.date(),
});

export type AgendaPeriodType = z.infer<typeof AgendaPeriodSchema>;
