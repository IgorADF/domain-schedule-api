import { vi } from "vitest";

export function setVitestSystemTime(date: Date) {
	vi.useFakeTimers();
	vi.setSystemTime(date);
}

export function useRealTimersVitest() {
	vi.useRealTimers();
}
