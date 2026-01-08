import z from "zod";
import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.interface.js";
import type { DayType } from "../shared/value-objects/day.js";
import type { GetAgendaConfigBySellerOrThrowUseCase } from "./get-agenda-config-by-seller-or-throw.js";

export const ListSellerSchedulesSchema = z.object({
	sellerId: z.uuid(),
	initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type ListSellerSchedulesType = z.infer<typeof ListSellerSchedulesSchema>;

export type ScheduleByDateType = {
	date: DayType;
	schedules: AgendaScheduleType[];
};

export type ListSellerSchedulesResponseType = {
	groupedSchedules: ScheduleByDateType[];
};

export class ListSellerSchedulesUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly getAgendaConfigBySellerOrThrowUseCase: GetAgendaConfigBySellerOrThrowUseCase,
	) {}

	async execute({
		sellerId,
		initialDate: initialDateString,
		finalDate: finalDateString,
	}: ListSellerSchedulesType): Promise<{
		data: ListSellerSchedulesResponseType;
	}> {
		const agendaConfig =
			await this.getAgendaConfigBySellerOrThrowUseCase.execute(sellerId);

		const initialDate = this.parseDateString(initialDateString);
		const finalDate = this.parseDateString(finalDateString);

		const schedules = await this.uow.agendaScheduleRepository.getByDateRange(
			agendaConfig.id,
			initialDate,
			finalDate,
		);

		const groupedSchedules = this.groupSchedulesByDate(schedules);

		return {
			data: {
				groupedSchedules,
			},
		};
	}

	private parseDateString(dateString: string): DayType {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day };
	}

	private sortSchedulesByDateAndTime(
		schedules: AgendaScheduleType[],
	): AgendaScheduleType[] {
		return [...schedules].sort((a, b) => {
			const dateComparison =
				a.day.year - b.day.year ||
				a.day.month - b.day.month ||
				a.day.day - b.day.day;

			if (dateComparison !== 0) return dateComparison;

			return (
				a.startTime.hour - b.startTime.hour ||
				a.startTime.minute - b.startTime.minute
			);
		});
	}

	private groupSchedulesByDate(
		schedules: AgendaScheduleType[],
	): ScheduleByDateType[] {
		const sortedSchedules = this.sortSchedulesByDateAndTime(schedules);
		const groupedMap = new Map<string, ScheduleByDateType>();

		for (const schedule of sortedSchedules) {
			const dateKey = `${schedule.day.year}-${schedule.day.month}-${schedule.day.day}`;

			if (!groupedMap.has(dateKey)) {
				groupedMap.set(dateKey, {
					date: schedule.day,
					schedules: [],
				});
			}

			groupedMap.get(dateKey)?.schedules.push(schedule);
		}

		return Array.from(groupedMap.values());
	}
}
