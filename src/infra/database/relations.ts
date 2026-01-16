import { defineRelations } from "drizzle-orm";
import * as schema from "./schema.js";

export const relations = defineRelations(schema, (r) => ({
	sellers: {
		agendaConfigs: r.one.agendaConfigs({
			from: r.sellers.id,
			to: r.agendaConfigs.sellerId,
		}),
	},

	agendaConfigs: {
		seller: r.one.sellers({
			from: r.agendaConfigs.sellerId,
			to: r.sellers.id,
		}),

		agendaEvents: r.many.agendaEvents(),

		agendaDayOfWeek: r.many.agendaDayOfWeek(),

		overwriteDay: r.many.overwriteDay(),

		agendaSchedules: r.many.agendaSchedules(),
	},

	agendaEvents: {
		agendaConfigs: r.one.agendaConfigs({
			from: r.agendaEvents.agendaConfigId,
			to: r.agendaConfigs.id,
		}),
	},

	agendaDayOfWeek: {
		agendaConfigs: r.one.agendaConfigs({
			from: r.agendaDayOfWeek.agendaConfigId,
			to: r.agendaConfigs.id,
		}),

		agendaPeriods: r.many.agendaPeriods(),
	},

	agendaPeriods: {
		agendaDayOfWeek: r.one.agendaDayOfWeek({
			from: r.agendaPeriods.agendaDayOfWeekId,
			to: r.agendaDayOfWeek.id,
		}),

		overwriteDay: r.one.overwriteDay({
			from: r.agendaPeriods.overwriteDayId,
			to: r.overwriteDay.id,
		}),
	},

	overwriteDay: {
		agendaConfigs: r.one.agendaConfigs({
			from: r.overwriteDay.agendaConfigId,
			to: r.agendaConfigs.id,
		}),

		agendaPeriods: r.many.agendaPeriods(),
	},

	agendaSchedules: {
		agendaConfigs: r.one.agendaConfigs({
			from: r.agendaSchedules.agendaConfigId,
			to: r.agendaConfigs.id,
		}),
	},
}));
