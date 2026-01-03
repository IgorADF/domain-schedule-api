import z from "zod";

export const DayObj = z.object({
	year: z.number().min(1970),
	month: z.number().min(1).max(12),
	day: z.number().min(1).max(31),
});

export type DayType = z.infer<typeof DayObj>;

/**
 * Convert DayObj to ISO date string (YYYY-MM-DD).
 */
export function dayToISOString(day: DayType): string {
	return `${day.year}-${day.month.toString().padStart(2, "0")}-${day.day.toString().padStart(2, "0")}`;
}
