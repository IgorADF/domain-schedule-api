import { QueueService } from "../queue.js";
import type { CreateServiceFactoryFunction } from "./_default.js";

export const createQueueService: CreateServiceFactoryFunction<
	QueueService
> = () => {
	return {
		service: new QueueService(),
	};
};
