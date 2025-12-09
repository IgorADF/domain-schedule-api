import z from "zod";
import { IdObj } from "./value-objects/id.js";

export const AgendaConfigSchema = z.object({
  id: IdObj,
  sellerId: IdObj,
  maxDaysOfAdvancedNotice: z.number().max(365 * 2),
  minHoursOfAdvancedNotice: z.number().min(1).optional(),
  timezone: z.string(),
});

export type AgendaConfigType = z.infer<typeof AgendaConfigSchema>;
