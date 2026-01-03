import type { OverwriteDayType } from "@domain/entities/overwrite-day.js";
import type { IOverwriteDayRepository } from "@domain/repositories/overwrite-day.interface.js";
import type { DayObj } from "@domain/shared/value-objects/day.js";
import { Op } from "sequelize";
import type z from "zod";
import OverwriteDayModel from "../database/models/overwrite-day.js";
import * as OverwriteDayMapper from "../entities/mappers/overwrite-day.js";
import { ClassRepository } from "./_default.js";

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

	async getByDateRange(
		agendaId: string,
		initialDate: z.infer<typeof DayObj>,
		finalDate: z.infer<typeof DayObj>,
	): Promise<OverwriteDayType[]> {
		const initialDateString = `${initialDate.year}-${initialDate.month.toString().padStart(2, "0")}-${initialDate.day.toString().padStart(2, "0")}`;
		const finalDateString = `${finalDate.year}-${finalDate.month.toString().padStart(2, "0")}-${finalDate.day.toString().padStart(2, "0")}`;

		const overwriteDays = await this.sequelizeRepository.findAll({
			where: {
				agendaId,
				day: {
					[Op.between]: [initialDateString, finalDateString],
				},
			},
			transaction: this.transaction,
		});

		return overwriteDays.map((o) => OverwriteDayMapper.toEntity(o));
	}
}
