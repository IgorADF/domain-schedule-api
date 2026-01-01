import type z from "zod";
import type { EnvsSchema } from "./envs.js";

export type EnvsType = z.infer<typeof EnvsSchema>;
