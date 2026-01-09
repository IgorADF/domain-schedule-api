import type { OverwriteDayType } from "@domain/entities/overwrite-day.js";
import type { IOverwriteDayRepository } from "@domain/repositories/overwrite-day.interface.js";
import {
	type DayType,
	dayToISOString,
} from "@domain/shared/value-objects/day.js";
import * as OverwriteDayMapper from "@infra/entities-mappers/overwrite-day.js";
import { Op } from "sequelize";
import OverwriteDayModel from "../database/models/overwrite-day.js";
import { ClassRepository } from "./_base-class.js";

export class OverwriteDayRepository
	extends ClassRepository
	implements IOverwriteDayRepository
{
	private sequelizeRepository =
		this.sequelizeConnection.getRepository(OverwriteDayModel);

	async create(data: OverwriteDayType): Promise<OverwriteDayType> {
		const modelInstance = OverwriteDayMapper.toModel(data);
		const overwriteDay = await this.sequelizeRepository.create(modelInstance, {
			transaction: this.transaction,
		});
		return OverwriteDayMapper.toEntity(overwriteDay);
	}

	async bulkCreate(data: OverwriteDayType[]): Promise<OverwriteDayType[]> {
		const modelInstances = data.map((d) => OverwriteDayMapper.toModel(d));
		const overwriteDays = await this.sequelizeRepository.bulkCreate(
			modelInstances,
			{ transaction: this.transaction },
		);
		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}

	async getByDateRange(
		agendaConfigId: string,
		initialDate: DayType,
		finalDate: DayType,
	): Promise<OverwriteDayType[]> {
		const initialDateString = dayToISOString(initialDate);
		const finalDateString = dayToISOString(finalDate);

		const overwriteDays = await this.sequelizeRepository.findAll({
			where: {
				agendaConfigId,
				day: {
					[Op.between]: [initialDateString, finalDateString],
				},
			},
			transaction: this.transaction,
		});

		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}
}
