import type z from "zod";
import type { OverwriteDayType } from "../entities/overwrite-day.js";
import type { DayObj } from "../shared/value-objects/day.js";

export interface IOverwriteDayRepository {
	create(data: OverwriteDayType): Promise<OverwriteDayType>;
	getByDateRange(
		agendaId: string,
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
	): Promise<OverwriteDayType[]>;
}
