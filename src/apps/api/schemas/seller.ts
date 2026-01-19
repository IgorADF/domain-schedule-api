import z from "zod";
import { SellerSchema } from "@/domain/entities/seller.js";

export const CreateSellerResponseSchema = z.object({
	data: SellerSchema,
});
