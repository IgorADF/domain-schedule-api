export interface IEmailService {
	send(
		to: string,
		subject: string,
		html: string,
	): Promise<{ success: boolean; error: any }>;
}
