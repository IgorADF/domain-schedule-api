import nodemailer from "nodemailer";
import { Envs } from "../envs/envs.js";

export class EmailService {
	private readonly transporter: nodemailer.Transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: Envs.SMTP_HOST,
			port: Envs.SMTP_PORT,
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
				from: Envs.EMAIL_FROM,
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
