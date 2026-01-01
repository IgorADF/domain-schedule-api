import type { ILogService } from "@/domain/services/log.interface.js";

export type CreateServiceFactoryReturn<T> = {
	service: T;
};

export type CreateServiceFactoryFunction<T> = (
	logService?: ILogService,
) => CreateServiceFactoryReturn<T>;
