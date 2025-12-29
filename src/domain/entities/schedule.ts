import z from "zod";
import { DayObj } from "../shared/value-objects/day.js";
import { IdObj } from "../shared/value-objects/id.js";
import { TimeObj } from "../shared/value-objects/time.js";
import { Timestamp } from "../shared/value-objects/timestamp.js";

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
