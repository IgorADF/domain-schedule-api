import z from "zod";
import {
	AgendaPeriodSchema,
	type AgendaPeriodType,
} from "../entities/agenda-periods.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";

export const CreateAgendaPeriodsSchema = z.array(
	AgendaPeriodSchema.pick({
		agendaDayOfWeekId: true,
		overwriteDayId: true,
		startTime: true,
		endTime: true,
		minutesOfService: true,
		minutesOfInterval: true,
	}),
);

export type CreateAgendaPeriodsType = z.infer<typeof CreateAgendaPeriodsSchema>;

export class CreateAgendaPeriodsUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async execute(
		input: CreateAgendaPeriodsType,
		persistData: boolean,
	): Promise<{ periods: AgendaPeriodType[] }> {
		const formattedPeriods: AgendaPeriodType[] = [];

		for (let iPeriods = 0; iPeriods < input.length; iPeriods++) {
			const period = input[iPeriods];

			const formattedPeriod = createEntity<AgendaPeriodType>({
				...period,
				order: iPeriods + 1,
			});

			const parsedPeriod = AgendaPeriodSchema.parse(formattedPeriod);
			formattedPeriods.push(parsedPeriod);
		}

		if (persistData) {
			await CreateAgendaPeriodsUseCase.bulkPersist(formattedPeriods, this.uow);
		}

		return { periods: formattedPeriods };
	}

	static async bulkPersist(data: AgendaPeriodType[], uow: IUnitOfWork) {
		await uow.agendaPeriodsRepository.bulkCreate(data);
	}
}
