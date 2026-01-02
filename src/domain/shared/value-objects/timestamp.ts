import z from "zod";

export const Timestamp = z.object({
	creationDate: z.date(),
	updateDate: z.date(),
});

export const ParanoidTimestamp = z
	.object({
		deletedAt: z.date().nullish(),
	})
	.extend(Timestamp.shape);
