import { SequelizeUnitOfWork } from "./sequelize-unit-of-work.js";

export function createSequelizeUOW() {
	return {
		uow: new SequelizeUnitOfWork(),
	};
}
