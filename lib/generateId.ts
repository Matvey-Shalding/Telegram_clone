export function generateId(max = 10_000): string {
	return String(Math.floor(Math.random() * (max + 1)))
}
