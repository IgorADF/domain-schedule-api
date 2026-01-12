import z from "zod";
import {
	AgendaPeriodSchema,
	type AgendaPeriodType,
} from "../entities/agenda-periods.js";
import { createEntity } from "../entities/helpers/creation.js";
import {
	OverwriteDaySchema,
	type OverwriteDayType,
} from "../entities/overwrite-day.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.interface.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";

export const CreateOverwriteDaysSchema = z.object({
	sellerId: z.uuid(),
	overwriteDays: z.array(
		z.object({
			day: OverwriteDaySchema.shape.day,
			cancelAllDay: OverwriteDaySchema.shape.cancelAllDay,
			periods: z
				.array(
					AgendaPeriodSchema.pick({
						startTime: true,
						endTime: true,
						minutesOfService: true,
						minutesOfInterval: true,
					}),
				)
				.optional(),
		}),
	),
});

export type CreateOverwriteDaysInput = z.infer<
	typeof CreateOverwriteDaysSchema
>;

export class CreateOverwriteDaysUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute(
		input: CreateOverwriteDaysInput,
	): Promise<{ data: OverwriteDayType[] }> {
		const agendaConfig = await this.uow.agendaConfigsRepository.getBySellerId(
			input.sellerId,
		);

		if (!agendaConfig) {
			throw new EntityNotFound();
		}

		const formattedOverwriteDays: OverwriteDayType[] = [];
		const allPeriods: AgendaPeriodType[] = [];

		for (const overwriteDay of input.overwriteDays) {
			const formattedOverwriteDay = createEntity<OverwriteDayType>({
				agendaConfigId: agendaConfig.id,
				day: overwriteDay.day,
				cancelAllDay: overwriteDay.cancelAllDay,
			});

			const parsedOverwriteDay = OverwriteDaySchema.parse(
				formattedOverwriteDay,
			);
			formattedOverwriteDays.push(parsedOverwriteDay);

			if (overwriteDay.periods && overwriteDay.periods.length > 0) {
				for (let i = 0; i < overwriteDay.periods.length; i++) {
					const period = overwriteDay.periods[i];

					const formattedPeriod = createEntity<AgendaPeriodType>({
						agendaDayOfWeekId: null,
						overwriteDayId: parsedOverwriteDay.id,
						startTime: period.startTime,
						endTime: period.endTime,
						minutesOfService: period.minutesOfService,
						minutesOfInterval: period.minutesOfInterval,
						order: i + 1,
					});

					const parsedPeriod = AgendaPeriodSchema.parse(formattedPeriod);
					allPeriods.push(parsedPeriod);
				}
			}
		}

		const createdOverwriteDays = await this.uow.withTransaction(async () => {
			const createdOverwriteDays =
				await this.uow.overwriteDayRepository.bulkCreate(
					formattedOverwriteDays,
				);

			if (allPeriods.length > 0) {
				await this.uow.agendaPeriodsRepository.bulkCreate(allPeriods);
			}

			return createdOverwriteDays;
		});

		return { data: createdOverwriteDays };
	}
}
