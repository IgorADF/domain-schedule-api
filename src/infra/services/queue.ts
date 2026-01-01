import { randomUUID } from "node:crypto";
import type { iQueueService } from "@/domain/services/queue.interface.js";
import type { QueuePublisher } from "@/infra/queue/publishers/publisher.js";

export class QueueService implements iQueueService {
	constructor(private readonly queuePublisher: QueuePublisher) {}

	async sendEmail(data: { to: string; subject: string; html: string }) {
		await this.queuePublisher.publish({
			id: randomUUID(),
			type: "send_email",
			data,
		});
	}
}
