import z from "zod";

export const DayObj = z.object({
  year: z.number().min(1970),
  month: z.number().min(1).max(12),
  day: z.number().min(1).max(31),
});
