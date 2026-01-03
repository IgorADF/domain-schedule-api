import type z from "zod";
import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { OverwriteDayType } from "../entities/overwrite-day.js";
import type { DayObj } from "../shared/value-objects/day.js";
import type { TimeObj } from "../shared/value-objects/time.js";

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

export type SlotAvailabilityContext = {
	agendaConfig: AgendaConfigType;
	daysOfWeek: AgendaDayOfWeekType[];
	periods: AgendaPeriodType[];
	overwriteDays: OverwriteDayType[];
	existingSchedules: AgendaScheduleType[];
};

/**
 * Service for slot availability calculations.
 * Centralizes all slot-related logic to avoid duplication.
 */
export class GenerateSlotsUseCase {
	/**
	 * Generate all possible slots for a date range based on agenda configuration.
	 */
	generateAllSlots(
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
		context: Pick<
			SlotAvailabilityContext,
			"agendaConfig" | "daysOfWeek" | "periods"
		>,
	): SlotType[] {
		const { agendaConfig, daysOfWeek, periods } = context;
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

			if (!dayConfig || dayConfig.cancelAllDay) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			const today = new Date();
			const diffDays = Math.ceil(
				(currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (diffDays > agendaConfig.maxDaysOfAdvancedNotice) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			const dayPeriods = periodsByDayOfWeek.get(dayConfig.id) || [];

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
	 * Generate slots within a single period based on service time and interval.
	 */
	generateSlotsFromPeriod(
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

			currentMinutes = slotEndMinutes + interval;
		}

		return slots;
	}

	/**
	 * Filter out slots that are already booked or cancelled by overwrite days.
	 */
	filterAvailableSlots(
		slots: SlotType[],
		context: Pick<
			SlotAvailabilityContext,
			"agendaConfig" | "overwriteDays" | "existingSchedules"
		>,
	): SlotType[] {
		const { agendaConfig, overwriteDays, existingSchedules } = context;
		const now = new Date();

		return slots.filter((slot) => {
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
	 * Check if a specific slot is available.
	 */
	isSlotAvailable(slot: SlotType, context: SlotAvailabilityContext): boolean {
		const {
			agendaConfig,
			daysOfWeek,
			periods,
			overwriteDays,
			existingSchedules,
		} = context;

		// 1. Check max days of advanced notice
		const slotDate = this.createDate(slot.day);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const diffDays = Math.ceil(
			(slotDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
		);

		if (diffDays > agendaConfig.maxDaysOfAdvancedNotice) {
			return false;
		}

		// 2. Check min hours of advanced notice
		if (agendaConfig.minHoursOfAdvancedNotice) {
			const slotDateTime = new Date(
				slot.day.year,
				slot.day.month - 1,
				slot.day.day,
				slot.startTime.hour,
				slot.startTime.minute,
			);
			const now = new Date();
			const minNoticeMs =
				agendaConfig.minHoursOfAdvancedNotice * 60 * 60 * 1000;

			if (slotDateTime.getTime() - now.getTime() < minNoticeMs) {
				return false;
			}
		}

		// 3. Check if day of week is configured and not cancelled
		const dayOfWeek = this.getDayOfWeek(slotDate);
		const dayConfig = daysOfWeek.find((d) => d.dayOfWeek === dayOfWeek);

		if (!dayConfig || dayConfig.cancelAllDay) {
			return false;
		}

		// 4. Check if day is cancelled by overwrite
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

		// 5. Check if slot fits within a configured period for this day
		const dayPeriods = periods.filter(
			(p) => p.agendaDayOfWeekId === dayConfig.id,
		);
		const slotFitsPeriod = this.checkSlotFitsPeriod(
			slot.startTime,
			slot.endTime,
			dayPeriods,
		);

		if (!slotFitsPeriod) {
			return false;
		}

		// 6. Check if slot overlaps with existing schedules
		const hasOverlap = existingSchedules.some(
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

		return !hasOverlap;
	}

	/**
	 * Check if a slot fits within any of the given periods.
	 */
	checkSlotFitsPeriod(
		startTime: z.infer<typeof TimeObj>,
		endTime: z.infer<typeof TimeObj>,
		periods: {
			startTime: z.infer<typeof TimeObj>;
			endTime: z.infer<typeof TimeObj>;
		}[],
	): boolean {
		const slotStartMinutes = startTime.hour * 60 + startTime.minute;
		const slotEndMinutes = endTime.hour * 60 + endTime.minute;

		return periods.some((period) => {
			const periodStartMinutes =
				period.startTime.hour * 60 + period.startTime.minute;
			const periodEndMinutes = period.endTime.hour * 60 + period.endTime.minute;

			return (
				slotStartMinutes >= periodStartMinutes &&
				slotEndMinutes <= periodEndMinutes
			);
		});
	}

	/**
	 * Check if two time ranges overlap.
	 * Note: Back-to-back times (end1 === start2 or end2 === start1) are NOT considered overlap.
	 */
	timesOverlap(
		start1: z.infer<typeof TimeObj>,
		end1: z.infer<typeof TimeObj>,
		start2: z.infer<typeof TimeObj>,
		end2: z.infer<typeof TimeObj>,
	): boolean {
		const start1Minutes = start1.hour * 60 + start1.minute;
		const end1Minutes = end1.hour * 60 + end1.minute;
		const start2Minutes = start2.hour * 60 + start2.minute;
		const end2Minutes = end2.hour * 60 + end2.minute;

		// Using < and > (not <= or >=) to allow back-to-back schedules
		return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
	}

	/**
	 * Group slots by day.
	 */
	groupSlotsByDay(slots: SlotType[]): DaySlots[] {
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

		const result: DaySlots[] = [];
		for (const [dayKey, timeSlots] of grouped) {
			const [year, month, day] = dayKey.split("-").map(Number);
			result.push({
				day: { year, month, day },
				slots: timeSlots,
			});
		}

		result.sort((a, b) => {
			if (a.day.year !== b.day.year) return a.day.year - b.day.year;
			if (a.day.month !== b.day.month) return a.day.month - b.day.month;
			return a.day.day - b.day.day;
		});

		return result;
	}

	/**
	 * Group periods by day of week ID.
	 */
	groupPeriodsByDayOfWeek(
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

		for (const [key, value] of map) {
			map.set(
				key,
				value.sort((a, b) => a.order - b.order),
			);
		}

		return map;
	}

	/**
	 * Create a Date object from DayObj.
	 */
	createDate(day: z.infer<typeof DayObj>): Date {
		return new Date(day.year, day.month - 1, day.day);
	}

	/**
	 * Get day of week (1-7, Monday=1, Sunday=7) from Date.
	 */
	getDayOfWeek(date: Date): number {
		const jsDay = date.getDay();
		return jsDay === 0 ? 7 : jsDay;
	}

	/**
	 * Parse date string (YYYY-MM-DD) to DayObj.
	 */
	parseDateString(dateString: string): z.infer<typeof DayObj> {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day };
	}
}
