import { createEmailService } from "@/core/services/factories/email.js";
import z from "zod";

export const EmailHandlerSchema = z.object({
	to: z.email(),
	subject: z.string().min(1),
	html: z.string().min(1),
});

type EmailTaskType = z.infer<typeof EmailHandlerSchema>;

export class EmailHandler {
	private readonly emailService = createEmailService().service;

	async handle(data: EmailTaskType): Promise<void> {
		try {
			console.log(`Sending email to ${data.to}...`);

			const result = await this.emailService.send(
				data.to,
				data.subject,
				data.html,
			);

			if (result.success) {
				console.log(`✓ Email sent successfully to ${data.to}`);
			} else {
				console.error(`✗ Failed to send email to ${data.to}:`, result.error);
				throw new Error("Email sending failed");
			}
		} catch (error) {
			console.error("Error in EmailHandler:", error);
			throw error;
		}
	}
}
