import z from "zod";
import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { OverwriteDayType } from "../entities/overwrite-day.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import type { DayObj } from "../shared/value-objects/day.js";
import type { TimeObj } from "../shared/value-objects/time.js";

export const ListAvailableSlotsSchema = z.object({
	sellerId: z.uuid(),
	initialDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	finalDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type ListAvailableSlotsInput = z.infer<typeof ListAvailableSlotsSchema>;

export type SlotType = {
	day: z.infer<typeof DayObj>;
	startTime: z.infer<typeof TimeObj>;
	endTime: z.infer<typeof TimeObj>;
};

export type TimeSlot = {
	startTime: z.infer<typeof TimeObj>;
	endTime: z.infer<typeof TimeObj>;
};

export type DaySlots = {
	day: z.infer<typeof DayObj>;
	slots: TimeSlot[];
};

export type AvailableSlotsOutput = {
	data: DaySlots[];
};

export class ListAvailableSlotsUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async execute({
		sellerId,
		initialDate: initialDateString,
		finalDate: finalDateString,
	}: ListAvailableSlotsInput): Promise<AvailableSlotsOutput> {
		const initialDate = this.parseDateString(initialDateString);
		const finalDate = this.parseDateString(finalDateString);

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

		const allSlots = this.generateAllSlots(
			initialDate,
			finalDate,
			daysOfWeek,
			periods,
			agendaConfig,
		);

		const availableSlots = this.filterAvailableSlots(
			allSlots,
			overwriteDays,
			existingSchedules,
			agendaConfig,
		);

		const groupedSlots = this.groupSlotsByDay(availableSlots);

		return { data: groupedSlots };
	}

	private generateAllSlots(
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
		daysOfWeek: AgendaDayOfWeekType[],
		periods: AgendaPeriodType[],
		agendaConfig: AgendaConfigType,
	): SlotType[] {
		const slots: SlotType[] = [];

		const periodsByDayOfWeek = this.groupPeriodsByDayOfWeek(
			daysOfWeek,
			periods,
		);

		const currentDate = this.createDate(initialDate);
		const endDate = this.createDate(finalDate);

		while (currentDate <= endDate) {
			const dayOfWeek = this.getDayOfWeek(currentDate);
			const dayConfig = daysOfWeek.find((d) => d.dayOfWeek === dayOfWeek);

			// Skip if no config for this day or if day is cancelled
			if (!dayConfig || dayConfig.cancelAllDay) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			// Check max days of advanced notice
			const today = new Date();
			const diffDays = Math.ceil(
				(currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (diffDays > agendaConfig.maxDaysOfAdvancedNotice) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			// Get periods for this day of week
			const dayPeriods = periodsByDayOfWeek.get(dayConfig.id) || [];

			// Generate slots for each period
			for (const period of dayPeriods) {
				const periodSlots = this.generateSlotsFromPeriod(
					{
						year: currentDate.getFullYear(),
						month: currentDate.getMonth() + 1,
						day: currentDate.getDate(),
					},
					period,
				);
				slots.push(...periodSlots);
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return slots;
	}

	/**
	 * Generate slots within a single period based on service time and interval
	 */
	private generateSlotsFromPeriod(
		day: z.infer<typeof DayObj>,
		period: AgendaPeriodType,
	): SlotType[] {
		const slots: SlotType[] = [];

		const startMinutes = period.startTime.hour * 60 + period.startTime.minute;
		const endMinutes = period.endTime.hour * 60 + period.endTime.minute;
		const serviceDuration = period.minutesOfService;
		const interval = period.minutesOfInterval ?? 0;

		let currentMinutes = startMinutes;

		while (currentMinutes + serviceDuration <= endMinutes) {
			const slotStartTime: z.infer<typeof TimeObj> = {
				hour: Math.floor(currentMinutes / 60),
				minute: currentMinutes % 60,
			};

			const slotEndMinutes = currentMinutes + serviceDuration;
			const slotEndTime: z.infer<typeof TimeObj> = {
				hour: Math.floor(slotEndMinutes / 60),
				minute: slotEndMinutes % 60,
			};

			slots.push({
				day,
				startTime: slotStartTime,
				endTime: slotEndTime,
			});

			// Move to next slot (service duration + interval)
			currentMinutes = slotEndMinutes + interval;
		}

		return slots;
	}

	/**
	 * Filter out slots that are already booked or cancelled by overwrite days
	 */
	private filterAvailableSlots(
		slots: SlotType[],
		overwriteDays: OverwriteDayType[],
		existingSchedules: AgendaScheduleType[],
		agendaConfig: AgendaConfigType,
	): SlotType[] {
		const now = new Date();

		return slots.filter((slot) => {
			// Check if day is cancelled by overwrite
			const isCancelledByOverwrite = overwriteDays.some(
				(o) =>
					o.cancelAllDay &&
					o.day.year === slot.day.year &&
					o.day.month === slot.day.month &&
					o.day.day === slot.day.day,
			);

			if (isCancelledByOverwrite) {
				return false;
			}

			// Check min hours of advanced notice
			if (agendaConfig.minHoursOfAdvancedNotice) {
				const slotDateTime = new Date(
					slot.day.year,
					slot.day.month - 1,
					slot.day.day,
					slot.startTime.hour,
					slot.startTime.minute,
				);
				const minNoticeMs =
					agendaConfig.minHoursOfAdvancedNotice * 60 * 60 * 1000;
				if (slotDateTime.getTime() - now.getTime() < minNoticeMs) {
					return false;
				}
			}

			// Check if slot is already booked
			const isBooked = existingSchedules.some(
				(schedule) =>
					schedule.day.year === slot.day.year &&
					schedule.day.month === slot.day.month &&
					schedule.day.day === slot.day.day &&
					this.timesOverlap(
						slot.startTime,
						slot.endTime,
						schedule.startTime,
						schedule.endTime,
					),
			);

			return !isBooked;
		});
	}

	/**
	 * Check if two time ranges overlap
	 */
	private timesOverlap(
		start1: z.infer<typeof TimeObj>,
		end1: z.infer<typeof TimeObj>,
		start2: z.infer<typeof TimeObj>,
		end2: z.infer<typeof TimeObj>,
	): boolean {
		const start1Minutes = start1.hour * 60 + start1.minute;
		const end1Minutes = end1.hour * 60 + end1.minute;
		const start2Minutes = start2.hour * 60 + start2.minute;
		const end2Minutes = end2.hour * 60 + end2.minute;

		return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
	}

	private groupPeriodsByDayOfWeek(
		daysOfWeek: AgendaDayOfWeekType[],
		periods: AgendaPeriodType[],
	): Map<string, AgendaPeriodType[]> {
		const map = new Map<string, AgendaPeriodType[]>();

		for (const day of daysOfWeek) {
			map.set(day.id, []);
		}

		for (const period of periods) {
			const existing = map.get(period.agendaDayOfWeekId) || [];
			existing.push(period);
			map.set(period.agendaDayOfWeekId, existing);
		}

		// Sort periods by order
		for (const [key, value] of map) {
			map.set(
				key,
				value.sort((a, b) => a.order - b.order),
			);
		}

		return map;
	}

	/**
	 * Create a Date object from DayObj
	 */
	private createDate(day: z.infer<typeof DayObj>): Date {
		return new Date(day.year, day.month - 1, day.day);
	}

	/**
	 * Get day of week (1-7, Monday=1, Sunday=7) from Date
	 */
	private getDayOfWeek(date: Date): number {
		const jsDay = date.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
		return jsDay === 0 ? 7 : jsDay; // Convert to 1=Monday, 7=Sunday
	}

	/**
	 * Parse date string (YYYY-MM-DD) to DayObj
	 */
	private parseDateString(dateString: string): z.infer<typeof DayObj> {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day };
	}

	/**
	 * Group slots by day
	 */
	private groupSlotsByDay(slots: SlotType[]): DaySlots[] {
		const grouped = new Map<string, TimeSlot[]>();

		for (const slot of slots) {
			const dayKey = `${slot.day.year}-${String(slot.day.month).padStart(2, "0")}-${String(slot.day.day).padStart(2, "0")}`;

			if (!grouped.has(dayKey)) {
				grouped.set(dayKey, []);
			}

			grouped.get(dayKey)?.push({
				startTime: slot.startTime,
				endTime: slot.endTime,
			});
		}

		// Convert map to array and sort by date
		const result: DaySlots[] = [];
		for (const [dayKey, timeSlots] of grouped) {
			const [year, month, day] = dayKey.split("-").map(Number);
			result.push({
				day: { year, month, day },
				slots: timeSlots,
			});
		}

		// Sort by date
		result.sort((a, b) => {
			if (a.day.year !== b.day.year) return a.day.year - b.day.year;
			if (a.day.month !== b.day.month) return a.day.month - b.day.month;
			return a.day.day - b.day.day;
		});

		return result;
	}
}
