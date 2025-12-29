export type TaskMessage = {
	id: string;
	type: string;
	data: unknown;
};

export class TaskHandler {
	async handle(message: TaskMessage): Promise<void> {
		console.log("Processing task:", {
			id: message.id,
			type: message.type,
		});

		// TODO: Add business logic here
		// Example: call use-cases based on message.type
		// switch (message.type) {
		//   case "schedule_created":
		//     await this.handleScheduleCreated(message.data);
		//     break;
		//   case "schedule_cancelled":
		//     await this.handleScheduleCancelled(message.data);
		//     break;
		// }

		console.log("✓ Task processed successfully");
	}
}
