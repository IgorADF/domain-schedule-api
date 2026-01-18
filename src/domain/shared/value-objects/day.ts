import z from "zod";

export const DayObj = z.object({
	year: z.number().min(1970),
	month: z.number().min(1).max(12),
	day: z.number().min(1).max(31),
});

export type DayType = z.infer<typeof DayObj>;

/**
 * Convert DayObj to JS Date object.
 */
export function toJSDate(day: DayType): Date {
	return new Date(day.year, day.month - 1, day.day);
}

/*
 * Convert ISO date string (YYYY-MM-DD) to DayObj.
 */
export function parseDateString(dateString: string): DayType {
	const [year, month, day] = dateString.split("-").map(Number);
	return { year, month, day };
}

/**
 * Convert ISO date string (YYYY-MM-DD) to DayObj.
 */
export function getDayFromDate(date: Date): DayType {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}
