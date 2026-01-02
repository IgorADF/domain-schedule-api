import z from "zod";
import { IdObj } from "../shared/value-objects/id.js";
import { TimeObj } from "../shared/value-objects/time.js";
import { Timestamp } from "../shared/value-objects/timestamp.js";

export const AgendaPeriodSchema = z
	.object({
		id: IdObj,
		agendaDayOfWeekId: IdObj,
		startTime: TimeObj,
		endTime: TimeObj,
		minutesOfService: z.number().positive().min(5).max(9999),
		minutesOfInterval: z.number().positive().min(5).max(9999).nullable(),
		order: z.number().positive().min(1).max(5),
	})
	.extend(Timestamp.shape);

export type AgendaPeriodType = z.infer<typeof AgendaPeriodSchema>;
