import { DateTime } from "luxon";

export function toDayObj(date: Date) {
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	};
}

export function toDateFormat(date: Date) {
	return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}
