import z from "zod";

export const Timestamp = z.object({
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const ParanoidTimestamp = z
	.object({
		deletedAt: z.date().nullish(),
	})
	.extend(Timestamp.shape);
