import { QueuePublisher } from "@/infra/queue/publishers/publisher.js";
import { QueueService } from "../queue.js";
import type { CreateServiceFactoryFunction } from "./_default.js";

export const createQueueService: CreateServiceFactoryFunction<
	QueueService
> = () => {
	const publisher = new QueuePublisher();

	return {
		service: new QueueService(publisher),
	};
};
