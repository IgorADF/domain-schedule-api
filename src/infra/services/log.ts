import type { ILogService } from "@/domain/services/log.interface.js";

type LogFunctionType = {
	info: (msg: string) => void;
	warn: (msg: string) => void;
	error: (msg: string) => void;
};

export class LogService implements ILogService {
	constructor(private readonly logFunction: LogFunctionType) {}

	static create(logFunction: LogFunctionType) {
		return new LogService(logFunction);
	}

	print(message: string, level: "info" | "warn" | "error") {
		this.logFunction[level](message);
	}

	info(message: string): void {
		this.logFunction.info(message);
	}

	warn(message: string): void {
		this.logFunction.warn(message);
	}

	error(message: string): void {
		this.logFunction.error(message);
	}
}
