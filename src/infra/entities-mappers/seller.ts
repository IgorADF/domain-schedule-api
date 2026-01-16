import {
	SellerSchema,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordSchemaType,
} from "@domain/entities/seller.js";
import type {
	InsertSeller,
	SelectSeller,
	SelectSellerWithPassword,
} from "../database/types.js";

export function toModel(sup: SelectSellerWithPassword): InsertSeller {
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
	sup: Partial<SelectSellerWithPassword>,
): Partial<InsertSeller> {
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

export function toEntity(sup: SelectSeller): SellerType {
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
	sup: SelectSellerWithPassword,
): SellerWithPasswordSchemaType {
	const map: SellerWithPasswordSchemaType = {
		...toEntity(sup),
		password: sup.password,
	};

	const entity = SellerWithPasswordSchema.parse(map);
	return entity;
}
