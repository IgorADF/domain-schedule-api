import type { OverwriteDayType } from "../entities/overwrite-day.js";
import type { DayType } from "../shared/value-objects/day.js";

export interface IOverwriteDayRepository {
	create(data: OverwriteDayType): Promise<OverwriteDayType>;
	bulkCreate(data: OverwriteDayType[]): Promise<OverwriteDayType[]>;
	getByDateRange(
		agendaId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<OverwriteDayType[]>;
}
