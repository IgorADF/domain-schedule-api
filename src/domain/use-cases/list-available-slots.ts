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
	slots: DaySlots[];
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
		const agendaConfigContext =
			await this.uow.agendaConfigsRepository.getFullContext({
				id: agendaConfigId,
			});

		if (!agendaConfigContext) {
			throw new EntityNotFound();
		}

		const {
			data: agendaConfig,
			daysOfWeekContext,
			overwriteDaysContext,
		} = agendaConfigContext;

		const { data: daysOfWeek, periods } = daysOfWeekContext;

		if (daysOfWeek.length === 0) {
			return { slots: [] };
		}

		const { data: overwriteDays, periods: overwritePeriods } =
			overwriteDaysContext;

		if (periods.length === 0 && overwritePeriods.length === 0) {
			return { slots: [] };
		}

		const initialDate = parseDateString(initialDateString);
		const finalDate = parseDateString(finalDateString);

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

		return { slots: groupedSlots };
	}
}
