import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import { createEntity } from "@domain/entities/helpers/creation.js";
import type { IUnitOfWork } from "@domain/repositories/uow/unit-of-work.js";
import z from "zod";
import type { GetAgendaConfigBySellerOrThrowUseCase } from "./get-agenda-config-by-seller-or-throw.js";

export const CreateAgendaEventSchema = AgendaEventSchema.pick({
	type: true,
	description: true,
}).extend({
	sellerId: z.uuid(),
});

export type CreateAgendaEventInput = z.infer<typeof CreateAgendaEventSchema>;

export class CreateAgendaEventUseCase {
	constructor(
		private readonly uow: IUnitOfWork,
		private readonly getAgendaConfigBySellerOrThrowUseCase: GetAgendaConfigBySellerOrThrowUseCase,
	) {}

	async execute(
		input: CreateAgendaEventInput,
	): Promise<{ data: AgendaEventType }> {
		const agendaConfig =
			await this.getAgendaConfigBySellerOrThrowUseCase.execute(input.sellerId);

		const agendaEvent = createEntity<AgendaEventType>({
			agendaConfigId: agendaConfig.id,
			type: input.type,
			description: input.description,
		});

		const parsedAgendaEvent = AgendaEventSchema.parse(agendaEvent);

		await this.uow.beginTransaction();

		try {
			const createdAgendaEvent =
				await this.uow.agendaEventRepository.create(parsedAgendaEvent);

			await this.uow.commitTransaction();
			return { data: createdAgendaEvent };
		} catch (error) {
			await this.uow.rollbackTransaction();
			throw error;
		}
	}
}
