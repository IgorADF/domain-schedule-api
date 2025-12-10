import z from "zod";
import { EnvsSchema } from "./envs.js";

export type EnvsType = z.infer<typeof EnvsSchema>;
