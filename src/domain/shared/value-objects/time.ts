import z from "zod";

export const TimeObj = z.object({
	hour: z.number().min(0).max(23),
	minute: z.number().min(0).max(59),
});

export type TimeType = z.infer<typeof TimeObj>;

export function toFormattedTimeString(time: TimeType) {
	return `${time.hour.toString().padStart(2, "0")}:${time.minute.toString().padStart(2, "0")}`;
}

export function fromFormattedTimeString(timeString: string): TimeType {
	const [hourStr, minuteStr] = timeString.split(":");
	return {
		hour: Number(hourStr),
		minute: Number(minuteStr),
	};
}
