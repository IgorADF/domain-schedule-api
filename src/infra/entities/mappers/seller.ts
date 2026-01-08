import {
	SellerSchema,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type SellerModel from "../../database/sequelize/models/seller.js";
import type { SellerModelType } from "../../database/sequelize/models/seller.js";

export function toModel(sup: SellerWithPasswordSchemaType): SellerModelType {
	return {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		password: sup.password,
		creationDate: sup.creationDate,
		updateDate: sup.updateDate,
		deleteDate: sup.deleteDate,
	};
}

export function toPartialModel(
	sup: Partial<SellerWithPasswordSchemaType>,
): Partial<SellerModelType> {
	return {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		password: sup.password,
		creationDate: sup.creationDate,
		updateDate: sup.updateDate,
		deleteDate: sup.deleteDate,
	};
}

export function toEntity(_sup: SellerModel): SellerType {
	const sup = _sup.toJSON();

	const map: SellerType = {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		creationDate: sup.creationDate,
		updateDate: sup.updateDate,
		deleteDate: sup.deleteDate,
	};

	const entity = SellerSchema.parse(map);
	return entity;
}

export function toEntityWithPassword(
	_sup: SellerModel,
): SellerWithPasswordSchemaType {
	const sup = _sup.toJSON();

	const map: SellerWithPasswordSchemaType = {
		...toEntity(_sup),
		password: sup.password,
	};

	const entity = SellerWithPasswordSchema.parse(map);
	return entity;
}
