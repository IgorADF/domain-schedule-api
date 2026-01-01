import type { MessageType } from "../../../infra/queue/message.js";
import { type EmailHandler, EmailHandlerSchema } from "./email-handler.js";

export class MainHandler {
	constructor(private readonly emailHandler: EmailHandler) {}

	async handle(message: MessageType): Promise<void> {
		console.log("Processing task:", {
			id: message.id,
			type: message.type,
		});

		switch (message.type) {
			case "send_email": {
				const data = EmailHandlerSchema.parse(message.data);
				await this.emailHandler.handle(data);
				break;
			}
			default:
				console.warn(`Unknown message type: ${message.type}`);
		}

		console.log("✓ Task processed successfully");
	}
}
