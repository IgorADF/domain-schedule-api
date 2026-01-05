import type z from "zod";
import {
	AgendaScheduleSchema,
	type AgendaScheduleType,
} from "../entities/agenda-schedule.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { ScheduleTooFarAhead } from "../shared/errors/schedule-too-far-ahead.js";
import { ScheduleTooSoon } from "../shared/errors/schedule-too-soon.js";
import { SlotNotAvailable } from "../shared/errors/slot-not-available.js";
import {
	type GenerateSlotsUseCase,
	SlotTimingValidation,
} from "./generate-slots.js";

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
		await this.validateSlotAvailability(input);

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
	): Promise<void> {
		const { agendaConfigId, day, startTime, endTime } = input;

		const agendaConfig =
			await this.uow.agendaConfigsRepository.getById(agendaConfigId);

		if (!agendaConfig) {
			throw new SlotNotAvailable();
		}

		// Validate timing limits first
		const timingValidation = this.generateSlotsUseCase.validateSlotTiming(
			{ day, startTime, endTime },
			agendaConfig,
		);

		if (timingValidation === SlotTimingValidation.TOO_SOON) {
			throw new ScheduleTooSoon();
		}

		if (timingValidation === SlotTimingValidation.TOO_FAR_AHEAD) {
			throw new ScheduleTooFarAhead();
		}

		const daysOfWeek =
			await this.uow.agendaDayOfWeekRepository.getByAgendaConfigId(
				agendaConfig.id,
			);

		if (daysOfWeek.length === 0) {
			throw new SlotNotAvailable();
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

		const isAvailable = this.generateSlotsUseCase.isSlotAvailable(
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

		if (!isAvailable) {
			throw new SlotNotAvailable();
		}
	}
}
