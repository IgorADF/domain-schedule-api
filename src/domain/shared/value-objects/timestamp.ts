import z from "zod";

export const Timestamp = z.object({
	creationDate: z.date(),
	updateDate: z.date(),
});

export type TimestampType = z.infer<typeof Timestamp>;

export const ParanoidTimestamp = z
	.object({
		deleteDate: z.date().nullable(),
	})
	.extend(Timestamp.shape);

export type ParanoidTimestampType = z.infer<typeof ParanoidTimestamp>;
