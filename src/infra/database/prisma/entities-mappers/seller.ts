import {
	SellerSchema,
	type SellerType,
	SellerWithPasswordSchema,
	type SellerWithPasswordType,
} from "@domain/entities/seller.js";
import type {
	CreateSellerPrisma,
	SellerPrisma,
	SellerWithPasswordPrisma,
} from "../types.js";

export function toModel(sup: SellerWithPasswordPrisma): CreateSellerPrisma {
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
	sup: Partial<SellerWithPasswordPrisma>,
): Partial<CreateSellerPrisma> {
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

export function toEntity(sup: SellerPrisma): SellerType {
	const map: SellerType = {
		id: sup.id,
		name: sup.name,
		email: sup.email,
		creationDate: sup.creationDate,
		updateDate: sup.updateDate,
		deleteDate: sup.deleteDate ?? null,
	};

	const entity = SellerSchema.parse(map);
	return entity;
}

export function toEntityWithPassword(
	sup: SellerWithPasswordPrisma,
): SellerWithPasswordType {
	const map: SellerWithPasswordType = {
		...toEntity(sup),
		password: sup.password,
	};

	const entity = SellerWithPasswordSchema.parse(map);
	return entity;
}
