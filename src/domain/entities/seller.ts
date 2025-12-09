import z from "zod";
import { IdObj } from "./value-objects/id.js";

export const SellerSchema = z.object({
  id: IdObj,
  email: z.email().min(1),
  password: z.string().min(6),
});

export type SellerType = z.infer<typeof SellerSchema>;
