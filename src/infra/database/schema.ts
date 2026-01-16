import * as p from "drizzle-orm/pg-core";

export const sellers = p.pgTable("Sellers", {
	id: p.uuid().primaryKey(),
	name: p.varchar({ length: 50 }).notNull(),
	email: p.varchar({ length: 50 }).notNull().unique(),
	password: p.varchar({ length: 100 }).notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
	deleteDate: p.timestamp({ mode: "date" }),
});

export const agendaConfigs = p.pgTable("AgendaConfigs", {
	id: p.uuid().primaryKey(),
	sellerId: p
		.uuid()
		.notNull()
		.unique()
		.references(() => sellers.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	maxDaysOfAdvancedNotice: p.integer().notNull(),
	minHoursOfAdvancedNotice: p.integer(),
	timezone: p.varchar({ length: 50 }).notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});

export const enumAgendaEventsType = p.pgEnum("enumAgendaEventsType", [
	"new_schedule",
	"cancel_by_client",
	"cancel_by_user",
	"reschedule_by_user",
]);

export const agendaEvents = p.pgTable("AgendaEvents", {
	id: p.uuid().primaryKey(),
	agendaConfigId: p
		.uuid()
		.notNull()
		.references(() => agendaConfigs.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	type: enumAgendaEventsType().notNull(),
	description: p.varchar({ length: 500 }).notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});

export const agendaDayOfWeek = p.pgTable("AgendaDayOfWeek", {
	id: p.uuid().primaryKey(),
	agendaConfigId: p
		.uuid()
		.notNull()
		.references(() => agendaConfigs.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	dayOfWeek: p.integer().notNull(),
	cancelAllDay: p.boolean().notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});

export const overwriteDay = p.pgTable("OverwriteDay", {
	id: p.uuid().primaryKey(),
	agendaConfigId: p
		.uuid()
		.notNull()
		.references(() => agendaConfigs.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	day: p.date({ mode: "string" }).notNull(),
	cancelAllDay: p.boolean().notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});

export const agendaPeriods = p.pgTable("AgendaPeriods", {
	id: p.uuid().primaryKey(),
	agendaDayOfWeekId: p.uuid().references(() => agendaDayOfWeek.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	overwriteDayId: p.uuid().references(() => overwriteDay.id, {
		onDelete: "cascade",
		onUpdate: "cascade",
	}),
	startTime: p.time().notNull(),
	endTime: p.time().notNull(),
	minutesOfService: p.integer().notNull(),
	minutesOfInterval: p.integer(),
	order: p.integer().notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});

export const agendaSchedules = p.pgTable("AgendaSchedules", {
	id: p.uuid().primaryKey(),
	agendaConfigId: p
		.uuid()
		.notNull()
		.references(() => agendaConfigs.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
	contactName: p.varchar({ length: 100 }).notNull(),
	contactPhoneNumber: p.varchar({ length: 20 }).notNull(),
	day: p.date({ mode: "string" }).notNull(),
	startTime: p.time().notNull(),
	endTime: p.time().notNull(),
	creationDate: p.timestamp({ mode: "date" }).notNull(),
	updateDate: p.timestamp({ mode: "date" }).notNull(),
});
