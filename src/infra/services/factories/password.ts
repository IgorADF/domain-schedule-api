import { PasswordService } from "../password.js";
import type { CreateServiceFactoryFunction } from "./_default.js";

export const createPasswordService: CreateServiceFactoryFunction<
	PasswordService
> = () => {
	return {
		service: new PasswordService(),
	};
};
