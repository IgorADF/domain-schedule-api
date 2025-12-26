import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "@domain/entities/agenda-config.js";
import { AgendaConfigsModel } from "../../database/models/agenda-configs.js";

export function toModel(agendaConfig: AgendaConfigType): AgendaConfigsModel {
	return new AgendaConfigsModel({
		id: agendaConfig.id,
		sellerId: agendaConfig.sellerId,
		maxDaysOfAdvancedNotice: agendaConfig.maxDaysOfAdvancedNotice,
		minHoursOfAdvancedNotice: agendaConfig?.minHoursOfAdvancedNotice,
		timezone: agendaConfig.timezone,
		createdAt: agendaConfig.createdAt,
		updatedAt: agendaConfig.updatedAt,
	});
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
