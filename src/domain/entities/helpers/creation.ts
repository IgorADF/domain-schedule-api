import { uuidv7 } from "uuidv7";

export function createEntity<T>(
	data: Omit<T, "id" | "creationDate" | "updateDate">,
): Omit<T, "id" | "creationDate" | "updateDate"> & {
	id: string;
	creationDate: Date;
	updateDate: Date;
} {
	const now = new Date();
	return {
		...data,
		id: uuidv7(),
		creationDate: now,
		updateDate: now,
	};
}
