import type z from "zod";
import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import { IdObj } from "../shared/value-objects/id.js";
import type { GetAgendaConfigBySellerOrThrowUseCase } from "./get-agenda-config-by-seller-or-throw.js";

export const ListAgendaConfigSchema = IdObj;

export type ListAgendaConfigType = z.infer<typeof ListAgendaConfigSchema>;

export type ListAgendaConfigResponseType = {
	agendaConfig: AgendaConfigType;
	agendaDaysOfWeek: Array<{
		dayOfWeek: AgendaDayOfWeekType;
		periods: AgendaPeriodType[];
	}>;
};

export class ListAgendaConfigUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly getAgendaConfigBySellerOrThrowUseCase: GetAgendaConfigBySellerOrThrowUseCase,
	) {}

	async execute(sellerId: ListAgendaConfigType): Promise<{
		data: ListAgendaConfigResponseType;
	}> {
		const agendaConfig =
			await this.getAgendaConfigBySellerOrThrowUseCase.executeThrowIfNotFound(
				sellerId,
			);

		const agendaDaysOfWeek =
			await this.uow.agendaDayOfWeekRepository.getByAgendaConfigId(
				agendaConfig.id,
			);

		const agendaDayOfWeekIds = agendaDaysOfWeek.map((day) => day.id);

		const allPeriods =
			await this.uow.agendaPeriodsRepository.getByAgendaDayOfWeekIds(
				agendaDayOfWeekIds,
			);

		const agendaDaysOfWeekWithPeriods = agendaDaysOfWeek.map((dayOfWeek) => {
			const periods = allPeriods.filter(
				(period) => period.agendaDayOfWeekId === dayOfWeek.id,
			);

			return {
				dayOfWeek,
				periods,
			};
		});

		return {
			data: {
				agendaConfig,
				agendaDaysOfWeek: agendaDaysOfWeekWithPeriods,
			},
		};
	}
}
