import z from "zod";

export const IdObj = z.uuidv7().min(1);

export type IdType = z.infer<typeof IdObj>;
