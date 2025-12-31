export interface ILogService {
	print(message: string, level: "info" | "warn" | "error"): void;
	info(message: string): void;
	warn(message: string): void;
	error(message: string): void;
}
