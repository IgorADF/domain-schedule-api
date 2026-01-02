import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import type AgendaEventModel from "../../database/models/agenda-event.js";
import type { AgendaEventModelType } from "../../database/models/agenda-event.js";

export function toModel(event: AgendaEventType): AgendaEventModelType {
	return {
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type,
		description: event.description,
		creationDate: event.creationDate,
		updateDate: event.updateDate,
	};
}

export function toEntity(_event: AgendaEventModel): AgendaEventType {
	const event = _event.toJSON();

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
