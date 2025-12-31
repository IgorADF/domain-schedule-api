import type { ILogService } from "@/domain/services/log.interface.js";

type LoggerType = {
	info: (msg: string) => void;
	warn: (msg: string) => void;
	error: (msg: string) => void;
};

export class LogService implements ILogService {
	constructor(private readonly logger: LoggerType) {}
	print(message: string, level: "info" | "warn" | "error") {
		this.logger[level](message);
	}

	info(message: string): void {
		this.logger.info(message);
	}

	warn(message: string): void {
		this.logger.warn(message);
	}

	error(message: string): void {
		this.logger.error(message);
	}
}
