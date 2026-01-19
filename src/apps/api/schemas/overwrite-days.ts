import z from "zod";
import { OverwriteDaySchema } from "@/domain/entities/overwrite-day.js";

export const CreateOverwriteDaysResponseSchema = z.object({
	data: z.array(OverwriteDaySchema),
});
