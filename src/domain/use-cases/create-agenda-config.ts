import type z from "zod";
import {
	AgendaConfigSchema,
	type AgendaConfigType,
} from "../entities/agenda-config.js";
import { createEntity } from "../entities/helpers/creation.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";

export const CreateAgendaConfigSchema = AgendaConfigSchema.pick({
	sellerId: true,
	maxDaysOfAdvancedNotice: true,
	minHoursOfAdvancedNotice: true,
	timezone: true,
});

export type CreateAgendaConfigType = z.infer<typeof CreateAgendaConfigSchema>;

export class CreateAgendaConfigUseCase {
	constructor(private uow: IUnitOfWork) {}

	async execute(input: CreateAgendaConfigType): Promise<{
		data: AgendaConfigType;
	}> {
		const agendaConfig = createEntity<AgendaConfigType>({
			...input,
		});

		const parsedConfig = AgendaConfigSchema.parse(agendaConfig);

		const createdConfig =
			await this.uow.agendaConfigsRepository.create(parsedConfig);

		return {
			data: createdConfig,
		};
	}
}
