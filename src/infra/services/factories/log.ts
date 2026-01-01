import { type LogFunctionType, LogService } from "../log.js";
import type { CreateServiceFactoryReturn } from "./_default.js";

export const createLogService = (
	logFunction: LogFunctionType,
): CreateServiceFactoryReturn<LogService> => {
	return {
		service: new LogService(logFunction),
	};
};
