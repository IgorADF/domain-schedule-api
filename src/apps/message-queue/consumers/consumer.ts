import { MainHandler } from "../handlers/_main.js";
import { EmailHandler } from "../handlers/email-handler.js";
import { MessageSchema } from "../message.js";
import { getChannel } from "../queue-config.js";

export class Consumer {
	private readonly queueName = "messages";
	private handler: MainHandler;

	constructor() {
		const emailHandler = new EmailHandler();
		this.handler = new MainHandler(emailHandler);
	}

	async start(): Promise<void> {
		const channel = await getChannel();
		await channel.assertQueue(this.queueName);

		console.log(`✓ Consuming messages from queue: ${this.queueName}`);

		channel.consume(this.queueName, async (msg) => {
			if (msg !== null) {
				try {
					const stringMessage = JSON.parse(msg.content.toString());
					const message = MessageSchema.parse(stringMessage);
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
