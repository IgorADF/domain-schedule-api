import { DateTime } from "luxon";

export function toDayObj(date: Date) {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}

export function toDateFormat(date: Date, format?: string) {
	return DateTime.fromJSDate(date).toFormat(format || "yyyy-MM-dd");
}
