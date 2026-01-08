import type { IUnitOfWork } from "../repositories/uow/unit-of-work.js";
import { EntityNotFound } from "../shared/errors/entity-not-found.js";

export class GetAgendaConfigBySellerOrThrowUseCase {
	constructor(private readonly uow: IUnitOfWork) {}

	async execute(sellerId: string) {
		const agendaConfig =
			await this.uow.agendaConfigsRepository.getBySellerId(sellerId);

		if (!agendaConfig) {
			throw new EntityNotFound();
		}

		return agendaConfig;
	}
}
