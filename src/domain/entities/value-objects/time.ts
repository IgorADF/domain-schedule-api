import z from "zod";

export const TimeObj = z.object({
  hour: z.number().min(0).max(23),
  minute: z.number().min(0).max(59),
});
