import type { OverwriteDayType } from "@domain/entities/overwrite-day.js";
import type { IOverwriteDayRepository } from "@domain/repositories/overwrite-day.interface.js";
import { type DayType, toJSDate } from "@domain/shared/value-objects/day.js";
import * as OverwriteDayMapper from "@/infra/entities-mappers/overwrite-day.js";
import { ClassRepository } from "./_base-class.js";

export class OverwriteDayRepository
	extends ClassRepository
	implements IOverwriteDayRepository
{
	async create(data: OverwriteDayType): Promise<OverwriteDayType> {
		const modelInstance = OverwriteDayMapper.toModel(data);
		const created = await this.prismaClient.overwriteDay.create({
			data: modelInstance,
		});
		return OverwriteDayMapper.toEntity(created);
	}

	async bulkCreate(data: OverwriteDayType[]): Promise<OverwriteDayType[]> {
		const modelInstances = data.map((d) => OverwriteDayMapper.toModel(d));
		await this.prismaClient.overwriteDay.createMany({
			data: modelInstances,
		});

		// Fetch created records
		const overwriteDays = await this.prismaClient.overwriteDay.findMany({
			where: {
				id: { in: data.map((d) => d.id) },
			},
		});

		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<OverwriteDayType[]> {
		const initialDateDate = toJSDate(initialDate);
		const finalDateDate = toJSDate(finalDate);

		const overwriteDays = await this.prismaClient.overwriteDay.findMany({
			where: {
				agendaConfigId: agendaConfigId,
				day: {
					gte: initialDateDate,
					lte: finalDateDate,
				},
			},
		});

		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}
}
