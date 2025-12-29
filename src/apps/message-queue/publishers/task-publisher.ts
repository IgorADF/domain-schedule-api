import { getChannel } from "../queue-config.js";

export type PublishTaskData = {
	id: string;
	type: string;
	data: unknown;
};

export class TaskPublisher {
	private readonly queueName = "tasks";

	async publish(task: PublishTaskData): Promise<void> {
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
