import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { Timestamp } from "./value-objects/timestamp.js";

export const AgendaEventTypeEnum = z.enum([
  "new_schedule",
  "cancel_by_client",
  "cancel_by_user",
  "reschedule_by_user",
]);

export type AgendaEventTypeType = z.infer<typeof AgendaEventTypeEnum>;

export const AgendaEventSchema = z
  .object({
    id: IdObj,
    agendaConfigId: IdObj,
    type: AgendaEventTypeEnum,
    description: z.string().min(1).max(500),
  })
  .extend(Timestamp.shape);

export type AgendaEventType = z.infer<typeof AgendaEventSchema>;
