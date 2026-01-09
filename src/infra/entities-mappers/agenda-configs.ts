import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "@domain/entities/agenda-config.js";
import type AgendaConfigsModel from "../database/models/agenda-configs.js";
import type { AgendaConfigsModelType } from "../database/models/agenda-configs.js";

export function toModel(
	agendaConfig: AgendaConfigType,
): AgendaConfigsModelType {
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

export function toEntity(_agendaConfig: AgendaConfigsModel): AgendaConfigType {
	const agendaConfig = _agendaConfig.toJSON();

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
