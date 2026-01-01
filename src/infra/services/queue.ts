import { randomUUID } from "node:crypto";
import { Publisher } from "@/apps/message-queue/publishers/publisher.js";
import type { iQueueService } from "@/domain/services/queue.interface.js";

export class QueueService implements iQueueService {
	private readonly queuePublisher: Publisher = new Publisher();

	async sendEmail(data: { to: string; subject: string; html: string }) {
		await this.queuePublisher.publish({
			id: randomUUID(),
			type: "send_email",
			data,
		});
	}
}
