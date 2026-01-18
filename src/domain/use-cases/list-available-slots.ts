import z from "zod";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";
import { parseDateString } from "../shared/value-objects/day.js";
import type { DaySlots, GenerateSlotsUseCase } from "./generate-slots.js";

export const ListAvailableSlotsSchema = z.object({
	agendaConfigId: z.uuid(),
	initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type ListAvailableSlotsInput = z.infer<typeof ListAvailableSlotsSchema>;

export type AvailableSlotsOutput = {
	data: DaySlots[];
};

export class ListAvailableSlotsUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly generateSlotsUseCase: GenerateSlotsUseCase,
	) {}

	async execute({
		agendaConfigId,
		initialDate: initialDateString,
		finalDate: finalDateString,
	}: ListAvailableSlotsInput): Promise<AvailableSlotsOutput> {
		const initialDate = parseDateString(initialDateString);
		const finalDate = parseDateString(finalDateString);

		const agendaConfig =
			await this.uow.agendaConfigsRepository.getById(agendaConfigId);

		if (!agendaConfig) {
			throw new EntityNotFound();
		}

		const daysOfWeek =
			await this.uow.agendaDayOfWeekRepository.getByAgendaConfigId(
				agendaConfig.id,
			);

		if (daysOfWeek.length === 0) {
			return { data: [] };
		}

		const dayOfWeekIds = daysOfWeek.map((d) => d.id);
		const periods =
			await this.uow.agendaPeriodsRepository.getByAgendaDayOfWeekIds(
				dayOfWeekIds,
			);

		const { overwriteDays, overwritePeriods } =
			await this.generateSlotsUseCase.fetchOverwriteContext(
				this.uow,
				agendaConfig.id,
				initialDate,
				finalDate,
			);

		// No slots available if there are no regular periods and no overwrite periods
		if (periods.length === 0 && overwritePeriods.length === 0) {
			return { data: [] };
		}

		const existingSchedules =
			await this.uow.agendaScheduleRepository.getByDateRange(
				agendaConfig.id,
				initialDate,
				finalDate,
			);

		const allSlots = this.generateSlotsUseCase.generateAllSlots(
			initialDate,
			finalDate,
			{
				agendaConfig,
				daysOfWeek,
				periods,
				overwriteDays,
				overwritePeriods,
			},
		);

		const availableSlots = this.generateSlotsUseCase.filterAvailableSlots(
			allSlots,
			{
				agendaConfig,
				existingSchedules,
			},
		);

		const groupedSlots = this.generateSlotsUseCase.groupSlotsByDayRange(
			availableSlots,
			initialDate,
			finalDate,
		);

		return { data: groupedSlots };
	}
}
