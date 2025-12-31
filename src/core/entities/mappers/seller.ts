import {
	SellerSchema,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type SellerModel from "../../database/models/seller.js";
import type { SellerModelType } from "../../database/models/seller.js";

export function toModel(sup: SellerWithPasswordSchemaType): SellerModelType {
	return {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		password: sup.password,
		createdAt: sup.createdAt,
		updatedAt: sup.updatedAt,
		deletedAt: sup.deletedAt ?? undefined,
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
		createdAt: sup.createdAt,
		updatedAt: sup.updatedAt,
		deletedAt: sup.deletedAt ?? undefined,
	};
}

export function toEntity(_sup: SellerModel): SellerType {
	const sup = _sup.toJSON();

	const map: SellerType = {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		createdAt: sup.createdAt,
		updatedAt: sup.updatedAt,
		deletedAt: sup.deletedAt,
	};

	const entity = SellerSchema.parse(map);
	return entity;
}

export function toEntityWithPassword(
	_sup: SellerModel,
): SellerWithPasswordSchemaType {
	const sup = _sup.toJSON();

	const map: SellerWithPasswordSchemaType = {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		password: sup.password,
		createdAt: sup.createdAt,
		updatedAt: sup.updatedAt,
		deletedAt: sup?.deletedAt,
	};

	const entity = SellerWithPasswordSchema.parse(map);
	return entity;
}
