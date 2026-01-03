import z from "zod";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import type { DaySlots, GenerateSlotsUseCase } from "./generate-slots.js";

export const ListAvailableSlotsSchema = z.object({
	sellerId: z.uuid(),
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
		sellerId,
		initialDate: initialDateString,
		finalDate: finalDateString,
	}: ListAvailableSlotsInput): Promise<AvailableSlotsOutput> {
		const initialDate =
			this.generateSlotsUseCase.parseDateString(initialDateString);
		const finalDate =
			this.generateSlotsUseCase.parseDateString(finalDateString);

		const agendaConfig =
			await this.uow.agendaConfigsRepository.getBySellerId(sellerId);

		if (!agendaConfig) {
			return { data: [] };
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

		if (periods.length === 0) {
			return { data: [] };
		}

		const overwriteDays = await this.uow.overwriteDayRepository.getByDateRange(
			agendaConfig.id,
			initialDate,
			finalDate,
		);

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
			},
		);

		const availableSlots = this.generateSlotsUseCase.filterAvailableSlots(
			allSlots,
			{
				agendaConfig,
				overwriteDays,
				existingSchedules,
			},
		);

		const groupedSlots =
			this.generateSlotsUseCase.groupSlotsByDay(availableSlots);

		return { data: groupedSlots };
	}
}
