import nodemailer from "nodemailer";
import type { IEmailService } from "@domain/services/email.interace.js";
import { Envs } from "../envs/envs.js";

export class EmailService implements IEmailService {
	private transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: Envs.SMTP_HOST ?? "smtp.gmail.com",
			port: Number(Envs.SMTP_PORT) ?? 587,
			secure: false,
			auth: {
				user: Envs.SMTP_USER,
				pass: Envs.SMTP_PASS,
			},
		});
	}

	async send(
		to: string,
		subject: string,
		html: string,
	): Promise<{ success: boolean; error: any }> {
		try {
			await this.transporter.sendMail({
				from: Envs.EMAIL_FROM ?? "noreply@yourapp.com",
				to,
				subject,
				html,
			});

			return { success: true, error: null };
		} catch (error) {
			return { success: false, error };
		}
	}
}
