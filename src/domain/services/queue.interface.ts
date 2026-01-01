export interface iQueueService {
	sendEmail: (data: {
		to: string;
		subject: string;
		html: string;
	}) => Promise<void>;
}
