import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import { AgendaEventModel } from "../../database/models/agenda-event.js";

export function toModel(event: AgendaEventType): AgendaEventModel {
	return new AgendaEventModel({
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type,
		description: event.description,
		createdAt: event.createdAt,
		updatedAt: event.updatedAt,
	});
}

export function toEntity(_event: AgendaEventModel): AgendaEventType {
	const event = _event.toJSON();

	const map: AgendaEventType = {
		id: event.id,
		agendaConfigId: event.agendaConfigId,
		type: event.type as AgendaEventType["type"],
		description: event.description,
		createdAt: event.createdAt,
		updatedAt: event.updatedAt,
	};

	const entity = AgendaEventSchema.parse(map);
	return entity;
}
