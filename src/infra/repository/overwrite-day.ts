import type { OverwriteDayType } from "@domain/entities/overwrite-day.js";
import type { IOverwriteDayRepository } from "@domain/repositories/overwrite-day.interface.js";
import {
	type DayType,
	dayToISOString,
} from "@domain/shared/value-objects/day.js";
import * as OverwriteDayMapper from "@/infra/entities-mappers/overwrite-day.js";
import { overwriteDay } from "../database/schema.js";
import { ClassRepository } from "./_base-class.js";

export class OverwriteDayRepository
	extends ClassRepository
	implements IOverwriteDayRepository
{
	async create(data: OverwriteDayType): Promise<OverwriteDayType> {
		const modelInstance = OverwriteDayMapper.toModel(data);
		const created = await this.connection
			.insert(overwriteDay)
			.values(modelInstance)
			.returning();
		return OverwriteDayMapper.toEntity(created[0]);
	}

	async bulkCreate(data: OverwriteDayType[]): Promise<OverwriteDayType[]> {
		const modelInstances = data.map((d) => OverwriteDayMapper.toModel(d));
		const overwriteDays = await this.connection
			.insert(overwriteDay)
			.values(modelInstances)
			.returning();
		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<OverwriteDayType[]> {
		const initialDateString = dayToISOString(initialDate);
		const finalDateString = dayToISOString(finalDate);

		const overwriteDays = await this.connection.query.overwriteDay.findMany({
			where: {
				agendaConfigId: agendaConfigId,
				day: {
					gte: initialDateString,
					lte: finalDateString,
				},
			},
		});

		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}
}
