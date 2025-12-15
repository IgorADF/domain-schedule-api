import z from "zod";
import { IdObj } from "./value-objects/id.js";

export const AgendaConfigSchema = z.object({
  id: IdObj,
  sellerId: IdObj,
  maxDaysOfAdvancedNotice: z
    .number()
    .max(365 * 2)
    .positive(),
  minHoursOfAdvancedNotice: z.number().min(1).max(9999).positive().optional(),
  timezone: z.string().max(50),
  createAt: z.date(),
  updatedAt: z.date(),
});

export type AgendaConfigType = z.infer<typeof AgendaConfigSchema>;
