import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "@domain/entities/agenda-config.js";
import type {
	AgendaConfigsPrisma,
	CreateAgendaConfigsPrisma,
} from "../types.js";

export function toModel(
	agendaConfig: AgendaConfigType,
): CreateAgendaConfigsPrisma {
	return {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig.minHoursOfAdvancedNotice ?? null,
		timezone: agendaConfig.timezone,
		creationDate: agendaConfig.creationDate,
		updateDate: agendaConfig.updateDate,
	};
}

export function toEntity(agendaConfig: AgendaConfigsPrisma): AgendaConfigType {
	const map: AgendaConfigType = {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig.minHoursOfAdvancedNotice ?? null,
		timezone: agendaConfig.timezone,
		creationDate: agendaConfig.creationDate,
		updateDate: agendaConfig.updateDate,
	};

	const entity = AgendaConfigSchema.parse(map);
	return entity;
}
