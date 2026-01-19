import z from "zod";
import { ErrorHandlerSchema } from "../handlers/errors/schema.js";

export const DefaultSuccessSchema = z.object({ success: z.boolean() });
export const DefaultErrorSchema = ErrorHandlerSchema;

export const NoAgendaConfiguredErrorSchema = DefaultErrorSchema.describe(
	"Seller has not agenda configured yet (ENTITY_NOT_FOUND)",
);
