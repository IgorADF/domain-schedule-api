import { EmailService } from "../email.js";
import type { CreateServiceFactoryFunction } from "./_default.js";

export const createEmailService: CreateServiceFactoryFunction<
	EmailService
> = () => {
	return {
		service: new EmailService(),
	};
};
