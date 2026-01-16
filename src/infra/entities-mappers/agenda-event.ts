import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import type {
	InsertAgendaEvent,
	SelectAgendaEvent,
} from "../database/types.js";

export function toModel(event: AgendaEventType): InsertAgendaEvent {
	return {
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type,
		description: event.description,
		creationDate: event.creationDate,
		updateDate: event.updateDate,
	};
}

export function toEntity(event: SelectAgendaEvent): AgendaEventType {
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
