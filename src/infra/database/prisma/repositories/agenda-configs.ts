import type { AgendaConfigType } from "@domain/entities/agenda-config.js";
import type { IAgendaConfigsRepository } from "@domain/repositories/agenda-configs.interface.js";
import type { AgendaDayOfWeekType } from "@/domain/entities/agenda-day-of-week.js";
import type { AgendaPeriodType } from "@/domain/entities/agenda-periods.js";
import type { OverwriteDayType } from "@/domain/entities/overwrite-day.js";
import * as AgendaConfigsMapper from "@/infra/database/prisma/entities-mappers/agenda-configs.js";
import * as AgendaDayOfWeekMapper from "@/infra/database/prisma/entities-mappers/agenda-day-of-week.js";
import * as AgendaPeriodsMapper from "@/infra/database/prisma/entities-mappers/agenda-periods.js";
import * as OverwriteDayMapper from "@/infra/database/prisma/entities-mappers/overwrite-day.js";
import { ClassRepository } from "./_base-class.js";

export class AgendaConfigsRepository
	extends ClassRepository
	implements IAgendaConfigsRepository
{
	async create(data: AgendaConfigType): Promise<AgendaConfigType> {
		const model = AgendaConfigsMapper.toModel(data);
		const created = await this.prismaClient.agendaConfig.create({
			data: model,
		});
		return AgendaConfigsMapper.toEntity(created);
	}

	async getById(id: string): Promise<AgendaConfigType | null> {
		const found = await this.prismaClient.agendaConfig.findFirst({
			where: { id },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}

	async getBySellerId(sellerId: string): Promise<AgendaConfigType | null> {
		const found = await this.prismaClient.agendaConfig.findFirst({
			where: { sellerId },
		});

		if (!found) return null;

		return AgendaConfigsMapper.toEntity(found);
	}

	async getFullContext(
		filter:
			| { id: string; sellerId?: undefined }
			| { id?: undefined; sellerId: string },
	): Promise<{
		data: AgendaConfigType;
		daysOfWeekContext: {
			data: AgendaDayOfWeekType[];
			periods: AgendaPeriodType[];
		};
		overwriteDaysContext: {
			data: OverwriteDayType[];
			periods: AgendaPeriodType[];
		};
	} | null> {
		const where = {
			id: filter?.id,
			sellerId: filter?.sellerId,
		};

		const agendaConfigContext = await this.prismaClient.agendaConfig.findFirst({
			where,
			include: {
				agendaDayOfWeek: {
					include: {
						agendaPeriods: true,
					},
				},
				overwriteDays: {
					include: {
						agendaPeriods: true,
					},
				},
			},
		});

		if (!agendaConfigContext) return null;

		const daysOfWeekEntity: AgendaDayOfWeekType[] = [];
		const daysOfWeekEntityPeriods: AgendaPeriodType[] = [];

		for (const daysOfWeek of agendaConfigContext.agendaDayOfWeek) {
			daysOfWeekEntity.push(AgendaDayOfWeekMapper.toEntity(daysOfWeek));
			daysOfWeekEntityPeriods.push(
				...daysOfWeek.agendaPeriods.map((period) =>
					AgendaPeriodsMapper.toEntity(period),
				),
			);
		}

		const overwriteDaysEntity: OverwriteDayType[] = [];
		const overwriteDaysEntityPeriods: AgendaPeriodType[] = [];

		for (const overwriteDay of agendaConfigContext.overwriteDays) {
			overwriteDaysEntity.push(OverwriteDayMapper.toEntity(overwriteDay));
			overwriteDaysEntityPeriods.push(
				...overwriteDay.agendaPeriods.map((period) =>
					AgendaPeriodsMapper.toEntity(period),
				),
			);
		}

		return {
			data: AgendaConfigsMapper.toEntity(agendaConfigContext),
			daysOfWeekContext: {
				data: daysOfWeekEntity,
				periods: daysOfWeekEntityPeriods,
			},
			overwriteDaysContext: {
				data: overwriteDaysEntity,
				periods: overwriteDaysEntityPeriods,
			},
		};
	}
}
