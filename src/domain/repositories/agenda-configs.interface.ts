import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { OverwriteDayType } from "../entities/overwrite-day.js";

export interface IAgendaConfigsRepository {
	getById(id: string): Promise<AgendaConfigType | null>;
	getBySellerId(sellerId: string): Promise<AgendaConfigType | null>;
	create(data: AgendaConfigType): Promise<AgendaConfigType>;
	getFullContext(
		filter:
			| { id: string; sellerId?: undefined }
			| { id?: undefined; sellerId: string },
	): Promise<{
		data: AgendaConfigType;
		daysOfWeekContext: {
			data: AgendaDayOfWeekType[];
			periods: AgendaPeriodType[];
		};
		overwriteDaysContext: {
			data: OverwriteDayType[];
			periods: AgendaPeriodType[];
		};
	} | null>;
}
