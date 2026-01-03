import type z from "zod";
import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "../entities/agenda-schedule.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { SlotNotAvailable } from "../shared/errors/slot-not-available.js";
import type { GenerateSlotsUseCase } from "./generate-slots.js";

export const CreateAgendaScheduleSchema = AgendaScheduleSchema.pick({
	agendaConfigId: true,
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
	constructor(
		private uow: IUnitOfWork,
		private generateSlotsUseCase: GenerateSlotsUseCase,
	) {}

	async execute(
		input: CreateAgendaScheduleType,
	): Promise<{ data: AgendaScheduleType }> {
		const isSlotAvailable = await this.validateSlotAvailability(input);

		if (!isSlotAvailable) {
			throw new SlotNotAvailable();
		}

		const agendaSchedule = createEntity<AgendaScheduleType>({
			...input,
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

	private async validateSlotAvailability(
		input: CreateAgendaScheduleType,
	): Promise<boolean> {
		const { agendaConfigId, day, startTime, endTime } = input;

		const agendaConfig =
			await this.uow.agendaConfigsRepository.getById(agendaConfigId);

		if (!agendaConfig) {
			return false;
		}

		const daysOfWeek =
			await this.uow.agendaDayOfWeekRepository.getByAgendaConfigId(
				agendaConfig.id,
			);

		if (daysOfWeek.length === 0) {
			return false;
		}

		const dayOfWeekIds = daysOfWeek.map((d) => d.id);
		const periods =
			await this.uow.agendaPeriodsRepository.getByAgendaDayOfWeekIds(
				dayOfWeekIds,
			);

		const { overwriteDays, overwritePeriods } =
			await this.generateSlotsUseCase.fetchOverwriteContext(
				this.uow,
				agendaConfig.id,
				day,
				day,
			);

		const existingSchedules =
			await this.uow.agendaScheduleRepository.getByDateRange(
				agendaConfig.id,
				day,
				day,
			);

		return this.generateSlotsUseCase.isSlotAvailable(
			{ day, startTime, endTime },
			{
				agendaConfig,
				daysOfWeek,
				periods,
				overwriteDays,
				overwritePeriods,
				existingSchedules,
			},
		);
	}
}
