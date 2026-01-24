import z from "zod";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";

export const DeleteAgendaScheduleSchema = z.object({
	id: z.uuid(),
	sellerId: z.uuid(),
});

export type DeleteAgendaScheduleType = z.infer<
	typeof DeleteAgendaScheduleSchema
>;

export class DeleteAgendaScheduleUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async execute(input: DeleteAgendaScheduleType): Promise<void> {
		const { id, sellerId } = input;

		const schedule = await this.uow.agendaScheduleRepository.getById(id);

		if (!schedule) {
			throw new EntityNotFound();
		}

		const agendaConfig = await this.uow.agendaConfigsRepository.getById(
			schedule.agendaConfigId,
		);

		if (!agendaConfig || agendaConfig.sellerId !== sellerId) {
			throw new EntityNotFound();
		}

		await this.uow.agendaScheduleRepository.delete(id);
	}
}
