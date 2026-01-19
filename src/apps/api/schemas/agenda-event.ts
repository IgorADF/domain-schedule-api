import z from "zod";
import { AgendaEventSchema } from "@/domain/entities/agenda-event.js";

export const ListSellerAgendaEventsResponseSchema = z.object({
	data: z.object({
		items: z.array(AgendaEventSchema),
		total: z.number().int().min(0),
		page: z.number().int().min(1),
		pageSize: z.number().int().min(1),
		totalPages: z.number().int().min(0),
	}),
});
