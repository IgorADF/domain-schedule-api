import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { ParanoidTimestamp } from "./value-objects/timestamp.js";

export const maxPasswordCreationLength = 30;

export const SellerSchema = z
	.object({
		id: IdObj,
		name: z.string().min(1).max(50),
		email: z.email().min(1).max(50),
	})
	.extend(ParanoidTimestamp.shape);

export const SellerWithPasswordSchema = SellerSchema.extend({
	password: z.string().min(6).max(100),
});

export type SellerType = z.infer<typeof SellerSchema>;
export type SellerWithPasswordSchemaType = z.infer<
	typeof SellerWithPasswordSchema
>;
