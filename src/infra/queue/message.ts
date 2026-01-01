import z from "zod";

export const MessageSchema = z.object({
	id: z.uuid(),
	type: z.enum(["send_email"]).nullable(),
	data: z.unknown(),
});

export type MessageType = z.infer<typeof MessageSchema>;
