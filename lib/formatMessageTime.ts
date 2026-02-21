export function formatMessageTime(value: unknown): string {
	const date = value instanceof Date ? value : typeof value === 'string' || typeof value === 'number' ? new Date(value) : null

	if (!date || isNaN(date.getTime())) {
		// fallback → client current time
		return new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return date.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	})
}
