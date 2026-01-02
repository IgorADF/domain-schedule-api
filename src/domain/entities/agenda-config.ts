import z from "zod";
import { IdObj } from "../shared/value-objects/id.js";
import { Timestamp } from "../shared/value-objects/timestamp.js";

export const AgendaConfigSchema = z
	.object({
		id: IdObj,
		sellerId: IdObj,
		maxDaysOfAdvancedNotice: z
			.number()
			.max(365 * 2)
			.positive(),
		minHoursOfAdvancedNotice: z.number().min(1).max(9999).positive().nullable(),
		timezone: z.string().max(50),
	})
	.extend(Timestamp.shape);

export type AgendaConfigType = z.infer<typeof AgendaConfigSchema>;
