import type z from "zod";
import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "../entities/agenda-schedule.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";

export const CreateAgendaScheduleSchema = AgendaScheduleSchema.pick({
	contactName: true,
	contactPhoneNumber: true,
	day: true,
	startTime: true,
	endTime: true,
});

export type CreateAgendaScheduleType = z.infer<
	typeof CreateAgendaScheduleSchema
>;

export class CreateAgendaScheduleUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute(
		input: CreateAgendaScheduleType,
	): Promise<{ data: AgendaScheduleType }> {
		const agendaSchedule = createEntity<AgendaScheduleType>({
			contactName: input.contactName,
			contactPhoneNumber: input.contactPhoneNumber,
			day: input.day,
			startTime: input.startTime,
			endTime: input.endTime,
		});

		const parsedSchedule = AgendaScheduleSchema.parse(agendaSchedule);

		await this.uow.beginTransaction();

		try {
			const newSchedule =
				await this.uow.agendaScheduleRepository.create(parsedSchedule);

			await this.uow.commitTransaction();
			return { data: newSchedule };
		} catch (error) {
			await this.uow.rollbackTransaction();
			throw error;
		}
	}
}
