import type z from "zod";
import {
	AgendaDayOfWeekSchema,
	type AgendaDayOfWeekType,
} from "../entities/agenda-day-of-week.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";

export const CreateAgendaDayOfWeekSchema = AgendaDayOfWeekSchema.pick({
	agendaConfigId: true,
	dayOfWeek: true,
	cancelAllDay: true,
});

export type CreateAgendaDayOfWeekType = z.infer<
	typeof CreateAgendaDayOfWeekSchema
>;

export class CreateAgendaDayOfWeekUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async execute(
		input: CreateAgendaDayOfWeekType,
		persistData: boolean = true,
	): Promise<{ data: AgendaDayOfWeekType }> {
		const agendaDayOfWeek = createEntity<AgendaDayOfWeekType>({
			...input,
		});

		const parsedDayOfWeek = AgendaDayOfWeekSchema.parse(agendaDayOfWeek);

		if (persistData) {
			await CreateAgendaDayOfWeekUseCase.persist(parsedDayOfWeek, this.uow);
		}

		return { data: parsedDayOfWeek };
	}

	static async persist(data: AgendaDayOfWeekType, uow: IUnitOfWork) {
		await uow.agendaDayOfWeekRepository.create(data);
	}

	static async bulkPersist(data: AgendaDayOfWeekType[], uow: IUnitOfWork) {
		await uow.agendaDayOfWeekRepository.bulkCreate(data);
	}
}
