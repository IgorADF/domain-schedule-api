import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "@domain/entities/agenda-config.js";
import type {
	AgendaConfigsModel,
	AgendaConfigsModelType,
} from "../../database/models/agenda-configs.js";

export function toModel(
	agendaConfig: AgendaConfigType,
): AgendaConfigsModelType {
	return {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig?.minHoursOfAdvancedNotice,
		timezone: agendaConfig.timezone,
		createdAt: agendaConfig.createdAt,
		updatedAt: agendaConfig.updatedAt,
	};
}

export function toEntity(_agendaConfig: AgendaConfigsModel): AgendaConfigType {
	const agendaConfig = _agendaConfig.toJSON();

	const map: AgendaConfigType = {
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig.minHoursOfAdvancedNotice,
		timezone: agendaConfig.timezone,
		createdAt: agendaConfig.createdAt,
		updatedAt: agendaConfig.updatedAt,
	};

	const entity = AgendaConfigSchema.parse(map);
	return entity;
}
