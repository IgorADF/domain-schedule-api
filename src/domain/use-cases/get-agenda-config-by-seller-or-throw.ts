import type { AgendaConfigType } from "../entities/agenda-config.js";
import type { IUnitOfWork } from "../repositories/_uow.interface.js";
import { EntityAlreadyExist } from "../shared/errors/entity-already-exist.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";

export class GetAgendaConfigBySellerOrThrowUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async executeThrowIfNotFound(
		sellerId: string,
	): Promise<{ agendaConfig: AgendaConfigType }> {
		const agendaConfig =
			await this.uow.agendaConfigsRepository.getBySellerId(sellerId);

		if (!agendaConfig) {
			throw new EntityNotFound();
		}

		return { agendaConfig };
	}

	async executeThrowIfFound(sellerId: string) {
		const agendaConfig =
			await this.uow.agendaConfigsRepository.getBySellerId(sellerId);

		if (agendaConfig) {
			throw new EntityAlreadyExist();
		}

		return { agendaConfig };
	}
}
