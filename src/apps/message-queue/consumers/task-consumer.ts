import { TaskHandler, type TaskMessage } from "../handlers/task-handler.js";
import { getChannel } from "../queue-config.js";

export class TaskConsumer {
	private readonly queueName = "tasks";
	private handler: TaskHandler;

	constructor() {
		this.handler = new TaskHandler();
	}

	async start(): Promise<void> {
		const channel = await getChannel();
		await channel.assertQueue(this.queueName);

		console.log(`✓ Consuming messages from queue: ${this.queueName}`);

		channel.consume(this.queueName, async (msg) => {
			if (msg !== null) {
				try {
					const message = JSON.parse(msg.content.toString()) as TaskMessage;
					await this.handler.handle(message);
					channel.ack(msg);
				} catch (error) {
					console.error("Error processing message:", error);
					// Reject and requeue the message on error
					channel.nack(msg, false, true);
				}
			} else {
				console.log("Consumer cancelled by server");
			}
		});
	}
}
