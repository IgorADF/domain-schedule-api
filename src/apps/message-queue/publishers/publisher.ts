import type { MessageType } from "../message.js";
import { getChannel } from "../queue-config.js";

export class Publisher {
	private readonly queueName = "messages";

	async publish(task: MessageType): Promise<void> {
		const channel = await getChannel();
		await channel.assertQueue(this.queueName);

		const message = JSON.stringify(task);
		channel.sendToQueue(this.queueName, Buffer.from(message), {
			persistent: true,
		});

		console.log("✓ Task published:", {
			id: task.id,
			type: task.type,
		});
	}
}
