import z from "zod";
import type { AgendaEventType } from "../entities/agenda-event.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import type { GetAgendaConfigBySellerOrThrowUseCase } from "./get-agenda-config-by-seller-or-throw.js";

export const ListSellerAgendaEventsSchema = z.object({
	sellerId: z.uuid(),
	page: z.coerce.number().int().positive().default(1),
	pageSize: z.coerce.number().int().positive().max(100).default(10),
});

export type ListSellerAgendaEventsInput = z.infer<
	typeof ListSellerAgendaEventsSchema
>;

export type ListSellerAgendaEventsResponse = {
	items: AgendaEventType[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
};

export class ListSellerAgendaEventsUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly getAgendaConfigBySellerOrThrowUseCase: GetAgendaConfigBySellerOrThrowUseCase,
	) {}

	async execute(
		input: ListSellerAgendaEventsInput,
	): Promise<{ data: ListSellerAgendaEventsResponse }> {
		const agendaConfig =
			await this.getAgendaConfigBySellerOrThrowUseCase.execute(input.sellerId);

		const { items, total } =
			await this.uow.agendaEventRepository.findByAgendaConfigIdPaginated(
				agendaConfig.id,
				input.page,
				input.pageSize,
				{ field: "creationDate", direction: "DESC" },
			);

		return {
			data: {
				items,
				total,
				page: input.page,
				pageSize: input.pageSize,
				totalPages: Math.ceil(total / input.pageSize),
			},
		};
	}
}
