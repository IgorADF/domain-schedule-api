import z from "zod";

export const ErrorSchema = z.object({
	error: z.string(),
	message: z.string(),
	details: z
		.array(z.object({ field: z.string(), message: z.string() }))
		.nullable(),
});

export type ErrorSchema = typeof ErrorSchema;
export type ErrorSchemaType = z.infer<ErrorSchema>;
