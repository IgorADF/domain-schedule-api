import z from "zod";
import { IdObj } from "./value-objects/id.js";
import { hashPassword } from "../../core/utils/password.js";

export const SellerSchema = z.object({
  id: IdObj,
  name: z.string().min(1).max(50),
  email: z.email().min(1).max(50),
  createAt: z.date(),
  updatedAt: z.date(),
  deleteAt: z.date().optional(),
});

export const SellerWithPasswordSchema = SellerSchema.extend({
  password: z
    .string()
    .min(6)
    .max(50)
    .transform((value) => hashPassword(value)),
});

export type SellerType = z.infer<typeof SellerSchema>;
export type SellerWithPasswordSchemaType = z.infer<
  typeof SellerWithPasswordSchema
>;
