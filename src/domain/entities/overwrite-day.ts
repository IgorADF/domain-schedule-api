import z from "zod";
import { DayObj } from "../shared/value-objects/day.js";
import { IdObj } from "../shared/value-objects/id.js";
import { Timestamp } from "../shared/value-objects/timestamp.js";

export const OverwriteDaySchema = z
	.object({
		id: IdObj,
		agendaConfigId: IdObj,
		day: DayObj,
		cancelAllDay: z.boolean(),
	})
	.extend(Timestamp.shape);

export type OverwriteDayType = z.infer<typeof OverwriteDaySchema>;
