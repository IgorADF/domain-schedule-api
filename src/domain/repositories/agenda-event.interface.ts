import type { AgendaEventType } from "../entities/agenda-event.js";

export type PaginatedResult<T> = {
	items: T[];
	total: number;
};

export type AgendaEventOrderByField = "creationDate" | "id";
export type AgendaEventOrderDirection = "ASC" | "DESC";

export type AgendaEventOrderBy = {
	field: AgendaEventOrderByField;
	direction: AgendaEventOrderDirection;
};

export interface IAgendaEventRepository {
	create(data: AgendaEventType): Promise<AgendaEventType>;
	bulkCreate(data: AgendaEventType[]): Promise<AgendaEventType[]>;
	findByAgendaConfigIdPaginated(
		agendaConfigId: string,
		page: number,
		pageSize: number,
		orderBy: AgendaEventOrderBy,
	): Promise<PaginatedResult<AgendaEventType>>;
}
