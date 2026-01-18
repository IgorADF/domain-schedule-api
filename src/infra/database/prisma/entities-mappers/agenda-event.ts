import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import type { AgendaEventPrisma, CreateAgendaEventPrisma } from "../types.js";

export function toModel(event: AgendaEventType): CreateAgendaEventPrisma {
	return {
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type,
		description: event.description,
		creationDate: event.creationDate,
		updateDate: event.updateDate,
	};
}

export function toEntity(event: AgendaEventPrisma): AgendaEventType {
	const map: AgendaEventType = {
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type as AgendaEventType["type"],
		description: event.description,
		creationDate: event.creationDate,
		updateDate: event.updateDate,
	};

	const entity = AgendaEventSchema.parse(map);
	return entity;
}
