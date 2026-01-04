import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { AgendaScheduleType } from "../entities/agenda-schedule.js";
import type { OverwriteDayType } from "../entities/overwrite-day.js";
import type { DayType } from "../shared/value-objects/day.js";
import type { TimeType } from "../shared/value-objects/time.js";

export type SlotType = {
	day: DayType;
	startTime: TimeType;
	endTime: TimeType;
};

export type TimeSlot = {
	startTime: TimeType;
	endTime: TimeType;
};

export type DaySlots = {
	day: DayType;
	slots: TimeSlot[];
};

export type SlotAvailabilityContext = {
	agendaConfig: AgendaConfigType;
	daysOfWeek: AgendaDayOfWeekType[];
	periods: AgendaPeriodType[];
	overwriteDays: OverwriteDayType[];
	overwritePeriods: AgendaPeriodType[];
	existingSchedules: AgendaScheduleType[];
};

/**
 * Service for slot availability calculations.
 * Centralizes all slot-related logic to avoid duplication.
 */
export class GenerateSlotsUseCase {
	/**
	 * Generate all possible slots for a date range based on agenda configuration.
	 * OverwriteDays with periods will take over the normal day configuration.
	 */
	generateAllSlots(
		initialDate: DayType,
		finalDate: DayType,
		context: Pick<
			SlotAvailabilityContext,
			| "agendaConfig"
			| "daysOfWeek"
			| "periods"
			| "overwriteDays"
			| "overwritePeriods"
		>,
	): SlotType[] {
		const {
			agendaConfig,
			daysOfWeek,
			periods,
			overwriteDays,
			overwritePeriods,
		} = context;
		const slots: SlotType[] = [];

		const periodsByDayOfWeek = this.groupPeriodsByDayOfWeek(
			daysOfWeek,
			periods,
		);

		const periodsByOverwriteDay = this.groupPeriodsByOverwriteDay(
			overwriteDays,
			overwritePeriods,
		);

		const currentDate = this.createDate(initialDate);
		const endDate = this.createDate(finalDate);

		while (currentDate <= endDate) {
			const currentDay: DayType = {
				year: currentDate.getFullYear(),
				month: currentDate.getMonth() + 1,
				day: currentDate.getDate(),
			};

			const today = new Date();
			const diffDays = Math.ceil(
				(currentDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
			);
			if (diffDays > agendaConfig.maxDaysOfAdvancedNotice) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			// Check if there's an overwrite day for this date
			const overwriteDay = overwriteDays.find(
				(o) =>
					o.day.year === currentDay.year &&
					o.day.month === currentDay.month &&
					o.day.day === currentDay.day,
			);

			if (overwriteDay) {
				// If cancelAllDay is true, skip this day entirely
				if (overwriteDay.cancelAllDay) {
					currentDate.setDate(currentDate.getDate() + 1);
					continue;
				}

				// Use overwrite day periods instead of regular day periods
				const overwritePeriodsForDay =
					periodsByOverwriteDay.get(overwriteDay.id) || [];

				for (const period of overwritePeriodsForDay) {
					const periodSlots = this.generateSlotsFromPeriod(currentDay, period);
					slots.push(...periodSlots);
				}

				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			// Normal day processing
			const dayOfWeek = this.getDayOfWeek(currentDate);
			const dayConfig = daysOfWeek.find((d) => d.dayOfWeek === dayOfWeek);

			if (!dayConfig || dayConfig.cancelAllDay) {
				currentDate.setDate(currentDate.getDate() + 1);
				continue;
			}

			const dayPeriods = periodsByDayOfWeek.get(dayConfig.id) || [];

			for (const period of dayPeriods) {
				const periodSlots = this.generateSlotsFromPeriod(currentDay, period);
				slots.push(...periodSlots);
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return slots;
	}

	/**
	 * Generate slots within a single period based on service time and interval.
	 */
	generateSlotsFromPeriod(day: DayType, period: AgendaPeriodType): SlotType[] {
		const slots: SlotType[] = [];

		const startMinutes = period.startTime.hour * 60 + period.startTime.minute;
		const endMinutes = period.endTime.hour * 60 + period.endTime.minute;
		const serviceDuration = period.minutesOfService;
		const interval = period.minutesOfInterval ?? 0;

		let currentMinutes = startMinutes;

		while (currentMinutes + serviceDuration <= endMinutes) {
			const slotStartTime: TimeType = {
				hour: Math.floor(currentMinutes / 60),
				minute: currentMinutes % 60,
			};

			const slotEndMinutes = currentMinutes + serviceDuration;
			const slotEndTime: TimeType = {
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
	 * Filter out slots that are already booked or don't meet advanced notice requirements.
	 */
	filterAvailableSlots(
		slots: SlotType[],
		context: Pick<
			SlotAvailabilityContext,
			"agendaConfig" | "existingSchedules"
		>,
	): SlotType[] {
		const { agendaConfig, existingSchedules } = context;
		const now = new Date();

		return slots.filter((slot) => {
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
	 * Validates that the requested slot matches exactly with an available generated slot.
	 */
	isSlotAvailable(slot: SlotType, context: SlotAvailabilityContext): boolean {
		const {
			agendaConfig,
			daysOfWeek,
			periods,
			overwriteDays,
			overwritePeriods,
			existingSchedules,
		} = context;

		// 1. Generate all possible slots for the requested day
		const allSlots = this.generateAllSlots(slot.day, slot.day, {
			agendaConfig,
			daysOfWeek,
			periods,
			overwriteDays,
			overwritePeriods,
		});

		// 2. Filter to get only available slots (not booked, respects notice times)
		const availableSlots = this.filterAvailableSlots(allSlots, {
			agendaConfig,
			existingSchedules,
		});

		// 3. Check if requested slot matches exactly with an available slot
		return this.slotMatchesExactly(slot, availableSlots);
	}

	/**
	 * Check if a slot matches exactly with one of the available slots.
	 * Both startTime and endTime must match exactly.
	 */
	slotMatchesExactly(slot: SlotType, availableSlots: SlotType[]): boolean {
		return availableSlots.some(
			(availableSlot) =>
				availableSlot.day.year === slot.day.year &&
				availableSlot.day.month === slot.day.month &&
				availableSlot.day.day === slot.day.day &&
				availableSlot.startTime.hour === slot.startTime.hour &&
				availableSlot.startTime.minute === slot.startTime.minute &&
				availableSlot.endTime.hour === slot.endTime.hour &&
				availableSlot.endTime.minute === slot.endTime.minute,
		);
	}

	/**
	 * Check if a slot fits within any of the given periods.
	 */
	checkSlotFitsPeriod(
		startTime: TimeType,
		endTime: TimeType,
		periods: {
			startTime: TimeType;
			endTime: TimeType;
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
		start1: TimeType,
		end1: TimeType,
		start2: TimeType,
		end2: TimeType,
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
	 * Group slots by day for a specific date range.
	 * Returns all days in the range, even if they have no available slots.
	 */
	groupSlotsByDayRange(
		slots: SlotType[],
		initialDate: DayType,
		finalDate: DayType,
	): DaySlots[] {
		const grouped = new Map<string, TimeSlot[]>();

		// Group existing slots
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

		// Create entries for all days in the range
		const result: DaySlots[] = [];
		const currentDate = this.createDate(initialDate);
		const endDate = this.createDate(finalDate);

		while (currentDate <= endDate) {
			const dayKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(2, "0")}`;

			result.push({
				day: {
					year: currentDate.getFullYear(),
					month: currentDate.getMonth() + 1,
					day: currentDate.getDate(),
				},
				slots: grouped.get(dayKey) || [],
			});

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return result;
	}

	/**
	 * Generic method to group periods by parent entity ID.
	 */
	private groupPeriodsById<T extends { id: string }>(
		parentEntities: T[],
		periods: AgendaPeriodType[],
		getParentId: (period: AgendaPeriodType) => string | null,
	): Map<string, AgendaPeriodType[]> {
		const map = new Map<string, AgendaPeriodType[]>();

		for (const parent of parentEntities) {
			map.set(parent.id, []);
		}

		for (const period of periods) {
			const parentId = getParentId(period);
			if (!parentId) continue;
			const existing = map.get(parentId) || [];
			existing.push(period);
			map.set(parentId, existing);
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
	 * Group periods by day of week ID.
	 */
	groupPeriodsByDayOfWeek(
		daysOfWeek: AgendaDayOfWeekType[],
		periods: AgendaPeriodType[],
	): Map<string, AgendaPeriodType[]> {
		return this.groupPeriodsById(
			daysOfWeek,
			periods,
			(p) => p.agendaDayOfWeekId,
		);
	}

	/**
	 * Group periods by overwrite day ID.
	 */
	groupPeriodsByOverwriteDay(
		overwriteDays: OverwriteDayType[],
		periods: AgendaPeriodType[],
	): Map<string, AgendaPeriodType[]> {
		return this.groupPeriodsById(
			overwriteDays,
			periods,
			(p) => p.overwriteDayId,
		);
	}

	/**
	 * Create a Date object from DayObj.
	 */
	createDate(day: DayType): Date {
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
	parseDateString(dateString: string): DayType {
		const [year, month, day] = dateString.split("-").map(Number);
		return { year, month, day };
	}

	/**
	 * Fetch overwrite days and their periods for a date range.
	 * Helper to reduce duplication across use cases.
	 */
	async fetchOverwriteContext(
		uow: {
			overwriteDayRepository: {
				getByDateRange: (
					agendaConfigId: string,
					initialDate: DayType,
					finalDate: DayType,
				) => Promise<OverwriteDayType[]>;
			};
			agendaPeriodsRepository: {
				getByOverwriteDayIds: (ids: string[]) => Promise<AgendaPeriodType[]>;
			};
		},
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<{
		overwriteDays: OverwriteDayType[];
		overwritePeriods: AgendaPeriodType[];
	}> {
		const overwriteDays = await uow.overwriteDayRepository.getByDateRange(
			agendaConfigId,
			initialDate,
			finalDate,
		);

		const overwriteDayIds = overwriteDays.map((o) => o.id);
		const overwritePeriods =
			overwriteDayIds.length > 0
				? await uow.agendaPeriodsRepository.getByOverwriteDayIds(
						overwriteDayIds,
					)
				: [];

		return { overwriteDays, overwritePeriods };
	}
}
