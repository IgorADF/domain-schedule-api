import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "@domain/entities/agenda-config.js";
import type {
	InsertAgendaConfigs,
	SelectAgendaConfigs,
} from "../database/types.js";

export function toModel(agendaConfig: AgendaConfigType): InsertAgendaConfigs {
	return {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig.minHoursOfAdvancedNotice,
		timezone: agendaConfig.timezone,
		creationDate: agendaConfig.creationDate,
		updateDate: agendaConfig.updateDate,
	};
}

export function toEntity(agendaConfig: SelectAgendaConfigs): AgendaConfigType {
	const map: AgendaConfigType = {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig.minHoursOfAdvancedNotice,
		timezone: agendaConfig.timezone,
		creationDate: agendaConfig.creationDate,
		updateDate: agendaConfig.updateDate,
	};

	const entity = AgendaConfigSchema.parse(map);
	return entity;
}
