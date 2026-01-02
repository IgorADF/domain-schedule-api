import z from "zod";
import { DayObj } from "../shared/value-objects/day.js";
import { IdObj } from "../shared/value-objects/id.js";
import { TimeObj } from "../shared/value-objects/time.js";
import { Timestamp } from "../shared/value-objects/timestamp.js";

export const AgendaScheduleSchema = z
	.object({
		id: IdObj,
		contactName: z.string().min(1).max(100),
		contactPhoneNumber: z.string().min(1).max(20),
		day: DayObj,
		startTime: TimeObj,
		endTime: TimeObj,
	})
	.extend(Timestamp.shape);

export type AgendaScheduleType = z.infer<typeof AgendaScheduleSchema>;
