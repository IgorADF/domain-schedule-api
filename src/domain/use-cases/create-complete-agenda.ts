import z from "zod";
import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { AgendaDayOfWeekType } from "../entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "../entities/agenda-periods.js";
import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { InvalidCreantionData } from "../shared/errors/invalid-creation-data.js";
import {
	CreateAgendaConfigSchema,
	CreateAgendaConfigUseCase,
} from "./create-agenda-config.js";
import {
	CreateAgendaDayOfWeekSchema,
	CreateAgendaDayOfWeekUseCase,
} from "./create-agenda-day-of-week.js";
import {
	CreateAgendaPeriodsSchema,
	CreateAgendaPeriodsUseCase,
} from "./create-agenda-periods.js";

const qtDaysOfWeek = 7;

export const CreateCompleteAgendaSchema = z.object({
	sellerId: z.uuid(),
	agendaConfig: CreateAgendaConfigSchema.pick({
		maxDaysOfAdvancedNotice: true,
		minHoursOfAdvancedNotice: true,
		timezone: true,
	}),
	daysOfWeek: z
		.array(
			z.object({
				dayOfWeek: CreateAgendaDayOfWeekSchema.pick({
					dayOfWeek: true,
					cancelAllDay: true,
				}),
				periods: z.array(
					CreateAgendaPeriodsSchema.element.pick({
						endTime: true,
						startTime: true,
						minutesOfService: true,
						minutesOfInterval: true,
					}),
				),
			}),
		)
		.length(qtDaysOfWeek),
});

type _AgendaConfigType = z.infer<
	typeof CreateCompleteAgendaSchema.shape.agendaConfig
>;

type _DaysOfWeekType = z.infer<
	typeof CreateCompleteAgendaSchema.shape.daysOfWeek
>;

type _PeriodsType = z.infer<
	typeof CreateCompleteAgendaSchema.shape.daysOfWeek.element.shape.periods
>;

export type CreateCompleteAgendaType = z.infer<
	typeof CreateCompleteAgendaSchema
>;

export class CreateCompleteAgendaUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute({
		sellerId,
		daysOfWeek,
		agendaConfig,
	}: CreateCompleteAgendaType): Promise<void> {
		try {
			await this.uow.beginTransaction();

			const createdConfig = await this.createAgendaConfig(
				agendaConfig,
				sellerId,
			);

			await this.createDaysOfWeek(createdConfig.data.id, daysOfWeek);

			await this.uow.commitTransaction();
		} catch (error) {
			await this.uow.rollbackTransaction();
			throw error;
		}
	}

	private async createAgendaConfig(
		input: _AgendaConfigType,
		sellerId: string,
	): Promise<{ data: AgendaConfigType }> {
		const useCaseData = {
			sellerId: sellerId,
			...input,
		};

		const parsedUseCaseData = CreateAgendaConfigSchema.parse(useCaseData);

		const createConfigUseCase = new CreateAgendaConfigUseCase(this.uow);
		return await createConfigUseCase.execute(parsedUseCaseData);
	}

	private async createDaysOfWeek(
		agendaConfigId: string,
		daysOfWeek: _DaysOfWeekType,
	): Promise<void> {
		if (daysOfWeek.length !== qtDaysOfWeek) {
			throw new InvalidCreantionData();
		}

		const daysOfWeekToCreate: AgendaDayOfWeekType[] = [];
		const periodsOfWeekToCreate: AgendaPeriodType[] = [];

		for (let iDaysOfWeek = 0; iDaysOfWeek < daysOfWeek.length; iDaysOfWeek++) {
			const dayOfWeekToCreate = {
				...daysOfWeek[iDaysOfWeek].dayOfWeek,

				agendaConfigId: agendaConfigId,
			};

			const parsedDayOfWeekToCreate =
				CreateAgendaDayOfWeekSchema.parse(dayOfWeekToCreate);

			const createAgendaDayOfWeekUseCase = new CreateAgendaDayOfWeekUseCase(
				this.uow,
			);

			const { data: createdDayOfWeek } =
				await createAgendaDayOfWeekUseCase.execute(
					parsedDayOfWeekToCreate,
					false,
				);

			const createdPeriods = await this.createPeriodsForDays(
				createdDayOfWeek.id,
				daysOfWeek[iDaysOfWeek].periods,
			);

			daysOfWeekToCreate.push(createdDayOfWeek);
			periodsOfWeekToCreate.push(...createdPeriods);
		}

		await CreateAgendaDayOfWeekUseCase.bulkPersist(
			daysOfWeekToCreate,
			this.uow,
		);

		await CreateAgendaPeriodsUseCase.bulkPersist(
			periodsOfWeekToCreate,
			this.uow,
		);
	}

	private async createPeriodsForDays(
		daysOfWeekId: string,
		periodsOfDays: _PeriodsType,
	): Promise<AgendaPeriodType[]> {
		const periodsToCreate = periodsOfDays.map((period) => ({
			...period,
			agendaDayOfWeekId: daysOfWeekId,
		}));

		const parsedPeriodsToCreate =
			CreateAgendaPeriodsSchema.parse(periodsToCreate);

		const createPeriodsUseCase = new CreateAgendaPeriodsUseCase(this.uow);
		const createdPeriods = await createPeriodsUseCase.execute(
			parsedPeriodsToCreate,
			false,
		);

		return createdPeriods.data;
	}
}
