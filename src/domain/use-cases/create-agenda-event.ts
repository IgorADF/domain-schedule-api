import {
	AgendaEventSchema,
	type AgendaEventType,
} from "@domain/entities/agenda-event.js";
import { createEntity } from "@domain/entities/helpers/creation.js";
import z from "zod";
import type { IUnitOfWork } from "@/domain/repositories/_uow.interface.js";
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
	): Promise<{ agendaEvent: AgendaEventType }> {
		const { agendaConfig } =
			await this.getAgendaConfigBySellerOrThrowUseCase.executeThrowIfNotFound(
				input.sellerId,
			);

		const agendaEvent = createEntity<AgendaEventType>({
			agendaConfigId: agendaConfig.id,
			type: input.type,
			description: input.description,
		});

		const parsedAgendaEvent = AgendaEventSchema.parse(agendaEvent);

		const createdAgendaEvent = await this.uow.withTransaction(async () => {
			return await this.uow.agendaEventRepository.create(parsedAgendaEvent);
		});

		return { agendaEvent: createdAgendaEvent };
	}
}
