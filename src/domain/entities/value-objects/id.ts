import z from "zod";

export const IdObj = z.uuidv7().min(1);
