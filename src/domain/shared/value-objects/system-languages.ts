import z from "zod";

export const SystemLanguages = z.enum([
	"en","pt"
]);

export type SystemLanguagesType = z.infer<typeof SystemLanguages>;
