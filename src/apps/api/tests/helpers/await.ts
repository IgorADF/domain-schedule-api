export function awaitTimer(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
