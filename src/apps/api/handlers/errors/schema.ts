import z from "zod";

export const ErrorHandlerSchema = z.object({
	error: z.string(),
	message: z.string(),
	details: z
		.array(z.object({ field: z.string(), message: z.string() }))
		.nullable(),
});

export type ErrorHandlerSchemaType = z.infer<typeof ErrorHandlerSchema>;
