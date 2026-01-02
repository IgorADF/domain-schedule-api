export function updateEntity<T>(data: Omit<Partial<T>, "updateDate">): Omit<
	Partial<T>,
	"updateDate"
> & {
	updateDate: Date;
} {
	const now = new Date();
	return {
		...data,
		updateDate: now,
	};
}
